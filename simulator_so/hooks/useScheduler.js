import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import AddProcessForm from '../components/AddProcessForm';

export function useScheduler(initialProcs) {
    // ============================================================
    // 1. INISIALISASI DATA PROSES DEFAULT
    // ============================================================
    const defaultProcs = useMemo(() => initialProcs || [
        {
            id: 'P1',
            priority: 1,
            instructions: [
                { type: 'CPU', duration: 2 },
                { type: 'LOCK', resource: 'A' },
                { type: 'CPU', duration: 3 },
                { type: 'UNLOCK', resource: 'A' },
                { type: 'CPU', duration: 1 },
                { type: 'END' },
            ],
        },
        {
            id: 'P2',
            priority: 5,
            instructions: [
                { type: 'CPU', duration: 1 },
                { type: 'LOCK', resource: 'A' },
                { type: 'CPU', duration: 5 },
                { type: 'UNLOCK', resource: 'A' },
                { type: 'END' },
            ],
        },
    ], [initialProcs]);

    // ============================================================
    // 2. DEFINISI STATE (STATUS SIMULASI)
    // ============================================================
    const [time, setTime] = useState(0);
    // State untuk menyimpan daftar proses beserta status dinamisnya (ip = instruction pointer)
    const [processes, setProcesses] = useState(() =>
        defaultProcs.map((p) => ({ ...p, ip: 0, remaining: 0, state: 'new' }))
    );
    const [readyQueue, setReadyQueue] = useState([]); // Antrian siap jalan
    const [blockedQueues, setBlockedQueues] = useState({ A: [], B: [] }); // Antrian menunggu resource
    const [resources, setResources] = useState({ A: null, B: null }); // Status Resource (Mutex)
    const [cpu, setCpu] = useState({ running: null, remaining: 0 }); // Status CPU saat ini
    const [algorithm, setAlgorithm] = useState('FCFS'); // Pilihan Algoritma
    const [quantum, setQuantum] = useState(2); // Time Quantum untuk RR
    const [log, setLog] = useState([]); // Log aktivitas teks
    const [gantt, setGantt] = useState([]); // Data visualisasi Gantt Chart

    const intervalRef = useRef(null);
    const runningRef = useRef(false);

    // ============================================================
    // 3. REFS UNTUK MENGHINDARI STALE CLOSURES
    // (Menyimpan state terbaru agar bisa diakses di dalam interval/callback)
    // ============================================================
    const processesRef = useRef(processes);
    const readyRef = useRef(readyQueue);
    const blockedRef = useRef(blockedQueues);
    const resourcesRef = useRef(resources);
    const cpuRef = useRef(cpu);
    const timeRef = useRef(time);

    useEffect(() => { processesRef.current = processes; }, [processes]);
    useEffect(() => { readyRef.current = readyQueue; }, [readyQueue]);
    useEffect(() => { blockedRef.current = blockedQueues; }, [blockedQueues]);
    useEffect(() => { resourcesRef.current = resources; }, [resources]);
    useEffect(() => { cpuRef.current = cpu; }, [cpu]);
    useEffect(() => { timeRef.current = time; }, [time]);

    // ============================================================
    // 4. INISIALISASI AWAL PADA T=0
    // ============================================================
    useEffect(() => {
        // Pindahkan semua proses default ke state 'ready' dan masukkan ke Ready Queue
        setProcesses((ps) => ps.map((p) => ({ ...p, state: 'ready' })));
        setReadyQueue(processes.map((p) => p.id));
        setLog((l) => [
            ...l,
            `T=0: ${processes.map((p) => `${p.id} (priority=${p.priority})`).join(', ')} tiba, masuk Ready Queue.`,
        ]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ============================================================
    // 5. HELPER FUNCTIONS (FUNGSI BANTUAN)
    // ============================================================
    const findProc = (id) => processesRef.current.find((p) => p.id === id);

    // Masukkan proses ke Ready Queue
    const enqueueReady = useCallback((id, note) => {
        setProcesses((ps) => ps.map((p) => (p.id === id ? { ...p, state: 'ready' } : p)));
        setReadyQueue((q) => (q.includes(id) ? q : [...q, id]));
        if (note) setLog((l) => [...l, `T=${timeRef.current}: ${note}`]);
    }, []);

    // Pindahkan proses ke Blocked Queue (saat menunggu resource)
    const blockOn = useCallback((id, r) => {
        setProcesses((ps) => ps.map((p) => (p.id === id ? { ...p, state: 'blocked' } : p)));
        setBlockedQueues((bq) => ({ ...bq, [r]: [...bq[r], id] }));
        setLog((l) => [...l, `T=${timeRef.current}: ${id} meminta Resource ${r} -> dipindahkan ke Blocked Queue (${r}).`] );
    }, []);

    // Coba bangunkan proses dari Blocked Queue jika resource tersedia
    const tryWake = useCallback((r) => {
        setBlockedQueues((bq) => {
            const queue = [...bq[r]];
            if (queue.length === 0) return bq;
            const next = queue.shift();
            setResources((res) => ({ ...res, [r]: next }));
            setProcesses((ps) => ps.map((p) => (p.id === next ? { ...p, state: 'ready' } : p)));
            setReadyQueue((rq) => [...rq, next]);
            setLog((l) => [...l, `T=${timeRef.current}: Resource ${r} diberikan ke ${next} (dari Blocked Queue).`] );
            return { ...bq, [r]: queue };
        });
    }, []);

    // ============================================================
    // 6. LOGIKA PEMILIHAN PROSES (ALGORITMA PENJADWALAN)
    // ============================================================
    const pickFromReady = useCallback(() => {
        const rq = readyRef.current;
        if (!rq || rq.length === 0) return null;

        // Algoritma FCFS & RR (Round Robin) sama-sama ambil yang paling depan
        if (algorithm === 'FCFS' || algorithm === 'RR') {
            return rq[0];
        }

        // Algoritma Priority (Angka lebih kecil = Prioritas lebih tinggi)
        if (algorithm === 'PRIORITY') {
            const sorted = [...rq].sort((a, b) => {
                const pa = findProc(a)?.priority ?? 99;
                const pb = findProc(b)?.priority ?? 99;
                return pa - pb;
            });
            return sorted[0];
        }

        // Algoritma SJF (Shortest Job First)
        if (algorithm === 'SJF') {
            const sorted = [...rq].sort((a, b) => {
                const pA = findProc(a);
                const pB = findProc(b);

                // Ambil durasi instruksi CPU saat ini
                const instA = pA?.instructions[pA.ip];
                const durationA = (instA && instA.type === 'CPU') ? instA.duration : 0;

                const instB = pB?.instructions[pB.ip];
                const durationB = (instB && instB.type === 'CPU') ? instB.duration : 0;

                // Sort dari durasi terpendek ke terpanjang
                if (durationA === durationB) {
                    return rq.indexOf(a) - rq.indexOf(b);
                }
                return durationA - durationB;
            });
            return sorted[0];
        }
        return rq[0];
    }, [algorithm]);

    // ============================================================
    // 7. PEREKAMAN DATA GANTT CHART
    // ============================================================
    const snapshotGantt = useCallback(() => {
        const entries = {};
        processesRef.current.forEach((p) => (entries[p.id] = p.state));
        if (cpuRef.current.running) entries[cpuRef.current.running] = 'running';
        setGantt((g) => [...g, { t: timeRef.current, entries }]);
    }, []);

    // ============================================================
    // 8. INTI SIMULASI (Dijalankan setiap detik/tick)
    // ============================================================
    const stepSimulation = useCallback(() => {
        // Tambah waktu simulasi
        setTime((t) => t + 1);

        const cpuNow = cpuRef.current;

        // --- KONDISI A: CPU SEDANG IDLE / KOSONG ---
        if (!cpuNow.running) {
            // Pilih proses dari Ready Queue berdasarkan algoritma
            const pick = pickFromReady();
            if (pick) {
                // Hapus dari Ready Queue
                setReadyQueue((rq) => rq.filter((x) => x !== pick));
                const p = findProc(pick);
                const inst = p.instructions[p.ip]; // Instruksi saat ini

                if (!inst || inst.type === 'END') {
                    // --- PROSES SELESAI ---
                    setProcesses((ps) => ps.map((pr) => (pr.id === pick ? { ...pr, state: 'finished' } : pr)));
                    setLog((l) => [...l, `T=${timeRef.current}: ${pick} selesai (instruksi END).`]);
                } else if (inst.type === 'CPU') {
                    // --- EKSEKUSI CPU ---
                    let runLen = inst.duration;
                    // Jika Round Robin, batasi durasi dengan Quantum
                    if (algorithm === 'RR') runLen = Math.min(runLen, quantum);
                    setCpu({ running: pick, remaining: runLen });
                    setProcesses((ps) => ps.map((pr) => (pr.id === pick ? { ...pr, state: 'running', remaining: runLen } : pr)));
                    setLog((l) => [...l, `T=${timeRef.current}: Penjadwal memilih ${pick} untuk dieksekusi.`]);
                } else if (inst.type === 'LOCK') {
                    // --- MEMINTA RESOURCE (LOCK) ---
                    const r = inst.resource;
                    if (!resourcesRef.current[r]) {
                        // Resource tersedia -> Ambil
                        setResources((res) => ({ ...res, [r]: pick }));
                        setProcesses((ps) => ps.map((pr) => (pr.id === pick ? { ...pr, ip: p.ip + 1, state: 'ready' } : pr)));
                        setReadyQueue((rq) => [...rq, pick]); // Masuk ready queue lagi untuk instruksi berikutnya
                        setLog((l) => [...l, `T=${timeRef.current}: Resource ${r} bebas. ${pick} meng-LOCK Resource ${r}.`]);
                    } else {
                        // Resource sibuk -> Blokir proses
                        blockOn(pick, r);
                    }
                } else if (inst.type === 'UNLOCK') {
                    // --- MELEPAS RESOURCE (UNLOCK) ---
                    const r = inst.resource;
                    setResources((res) => {
                        const newRes = { ...res, [r]: null };
                        setLog((l) => [...l, `T=${timeRef.current}: ${pick} melakukan UNLOCK Resource ${r}.`]);
                        tryWake(r); // Coba bangunkan proses lain yang menunggu
                        return newRes;
                    });
                    setProcesses((ps) => ps.map((pr) => (pr.id === pick ? { ...pr, ip: p.ip + 1, state: 'ready' } : pr)));
                    setReadyQueue((rq) => [...rq, pick]); // Masuk ready queue lagi
                } else {
                     // Fallback instruksi tidak dikenal
                     enqueueReady(pick, `${pick} masuk Ready Queue (instruksi tidak dikenal).`);
                }
            }
        } else {
            // --- KONDISI B: CPU SEDANG BEKERJA (RUNNING) ---
            setCpu((c) => {
                const remaining = c.remaining - 1;
                // Jika masih ada sisa waktu, lanjutkan
                if (remaining > 0) return { ...c, remaining };

                // --- PENANGANAN KHUSUS ROUND ROBIN (BUG FIX PREEMPTION) ---
                const pid = c.running;
                const p = findProc(pid);
                const curInst = p.instructions[p.ip];

                // Cek apakah instruksi sekarang adalah CPU
                if (curInst && curInst.type === 'CPU') {
                    // Hitung waktu yang sudah dijalankan
                    const timeExecuted = (algorithm === 'RR') ? Math.min(curInst.duration, quantum) : curInst.duration;
                    
                    // Hitung sisa durasi instruksi sebenarnya
                    const realRemaining = curInst.duration - timeExecuted;

                    if (realRemaining > 0) {
                         // KASUS RR: Waktu Quantum habis, tapi instruksi belum kelar.
                         // 1. Update durasi instruksi di state proses menjadi sisa waktu
                         setProcesses((ps) => ps.map((pr) => {
                            if (pr.id === pid) {
                                const newInstructions = [...pr.instructions];
                                newInstructions[pr.ip] = { ...curInst, duration: realRemaining };
                                return { ...pr, instructions: newInstructions, state: 'ready', remaining: 0 };
                            }
                            return pr;
                         }));
                         
                         // 2. Masukkan kembali ke Ready Queue (Preemption / Context Switch)
                         setReadyQueue((rq) => [...rq, pid]);
                         setLog((l) => [...l, `T=${timeRef.current + 1}: ${pid} Quantum habis, sisa burst ${realRemaining}. Kembali ke Ready Queue.`]);
                         
                         return { running: null, remaining: 0 };
                    }
                }
                // --- AKHIR PENANGANAN ROUND ROBIN ---

                // Jika sampai sini, berarti instruksi benar-benar selesai
                // Lanjut ke Instruction Pointer (IP) berikutnya
                let nextIp = p.ip;
                if (curInst && curInst.type === 'CPU') nextIp = p.ip + 1;

                const nextInst = p.instructions[nextIp];
                
                // Update proses ke state idle sementara sebelum diproses ulang
                 setProcesses((ps) => ps.map((pr) => (pr.id === pid ? { ...pr, ip: nextIp, remaining: 0, state: 'idle' } : pr)));
                 setLog((l) => [...l, `T=${timeRef.current + 1}: ${pid} menyelesaikan CPU burst.`]);

                 // Cek Instruksi Selanjutnya (Next Instruction)
                 if (!nextInst || nextInst.type === 'END') {
                    setProcesses((ps) => ps.map((pr) => (pr.id === pid ? { ...pr, state: 'finished' } : pr)));
                    setLog((l) => [...l, `T=${timeRef.current + 1}: ${pid} selesai.`]);
                    return { running: null, remaining: 0 };
                 }
                 
                 if (nextInst.type === 'LOCK') {
                     const r = nextInst.resource;
                    if (!resourcesRef.current[r]) {
                        setResources((res) => ({ ...res, [r]: pid }));
                        setProcesses((ps) => ps.map((pr) => (pr.id === pid ? { ...pr, ip: nextIp + 1, state: 'ready' } : pr)));
                        setReadyQueue((rq) => [...rq, pid]);
                        setLog((l) => [...l, `T=${timeRef.current + 1}: Resource ${r} bebas. ${pid} meng-LOCK Resource ${r}.`]);
                    } else {
                        blockOn(pid, r);
                    }
                    return { running: null, remaining: 0 };
                 }

                 if (nextInst.type === 'UNLOCK') {
                    const r = nextInst.resource;
                    setResources((res) => {
                        const newRes = { ...res, [r]: null };
                        setLog((l) => [...l, `T=${timeRef.current + 1}: ${pid} melakukan UNLOCK Resource ${r}.`]);
                        tryWake(r);
                        return newRes;
                    });
                    setProcesses((ps) => ps.map((pr) => (pr.id === pid ? { ...pr, ip: nextIp + 1, state: 'ready' } : pr)));
                    setReadyQueue((rq) => [...rq, pid]);
                    return { running: null, remaining: 0 };
                 }

                 if (nextInst.type === 'CPU') {
                    setProcesses((ps) => ps.map((pr) => (pr.id === pid ? { ...pr, state: 'ready', ip: nextIp } : pr)));
                    setReadyQueue((rq) => [...rq, pid]);
                    return { running: null, remaining: 0 };
                 }

                 return { running: null, remaining: 0 };
            });
        }

        // Rekam snapshot untuk Gantt Chart
        snapshotGantt();
    }, [pickFromReady, enqueueReady, blockOn, tryWake, algorithm, quantum, snapshotGantt]);

    // ============================================================
    // 9. KONTROL SIMULASI (START, PAUSE, RESET)
    // ============================================================
    const startSimulation = useCallback(() => {
        if (intervalRef.current) return;
        runningRef.current = true;
        // Jalankan stepSimulation setiap 1 detik
        intervalRef.current = setInterval(() => {
            stepSimulation();
        }, 1000);
    }, [stepSimulation]);

    const pauseSimulation = useCallback(() => {
        runningRef.current = false;
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const resetSimulation = useCallback(() => {
        pauseSimulation();
        setTime(0);
        // Reset semua state ke kondisi awal
        setProcesses(defaultProcs.map((p) => ({ ...p, ip: 0, remaining: 0, state: 'ready' })));
        setReadyQueue(defaultProcs.map((p) => p.id));
        setBlockedQueues({ A: [], B: [] });
        setResources({ A: null, B: null });
        setCpu({ running: null, remaining: 0 });
        setLog([]);
        setGantt([]);
        }, [pauseSimulation, defaultProcs]);

    // ============================================================
    // 10. MENAMBAHKAN PROSES BARU
    // ============================================================
    const addProcess = useCallback((newProcess) => {
        // Cek duplikat ID
        if (processesRef.current.find(p => p.id === newProcess.id)) {
            alert(`Error: Process ID ${newProcess.id} sudah ada.`);
            return;
        }

        // Siapkan proses baru dengan state awal
        const processWithState = {
            ...newProcess,
            ip: 0, // Instruction Pointer awal
            remaining: 0,
            state: 'ready', // Langsung masuk 'ready'
        };

        setProcesses((ps) => [...ps, processWithState]);
        setReadyQueue((rq) => [...rq, newProcess.id]);
        setLog((l) => [
            ...l,
            `T=${timeRef.current}: ${newProcess.id} (priority=${newProcess.priority}) tiba, masuk Ready Queue.`,
        ]);
    }, []);

    // ============================================================
    // 11. EXPOSE API KE UI
    // ============================================================
    return {
        processes,
        readyQueue,
        blockedQueues,
        resources,
        cpu,
        currentTime: time,
        startSimulation,
        pauseSimulation,
        stepSimulation,
        resetSimulation,
        algorithm,
        setAlgorithm,
        quantum,
        setQuantum,
        gantt,
        log,
        addProcess,
    };
}

export default useScheduler;