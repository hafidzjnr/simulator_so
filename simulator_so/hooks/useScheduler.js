import { useState, useRef, useEffect, useCallback, useMemo } from 'react';

// Full-featured scheduler hook
// - Processes have instructions: [{type: 'CPU'|'LOCK'|'UNLOCK'|'END', duration?, resource?}]
// - Resources: A and B (mutex). Each resource holds null or process id.
// - Queues: readyQueue (array of ids), blockedQueues: { A:[], B:[] }
// - Scheduler algorithms: FCFS, PRIORITY (lower number = higher), RR (quantum)

export function useScheduler(initialProcs) {
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

    // State
    const [time, setTime] = useState(0);
    const [processes, setProcesses] = useState(() =>
        defaultProcs.map((p) => ({ ...p, ip: 0, remaining: 0, state: 'new' }))
    );
    const [readyQueue, setReadyQueue] = useState([]);
    const [blockedQueues, setBlockedQueues] = useState({ A: [], B: [] });
    const [resources, setResources] = useState({ A: null, B: null });
    const [cpu, setCpu] = useState({ running: null, remaining: 0 });
    const [algorithm, setAlgorithm] = useState('FCFS');
    const [quantum, setQuantum] = useState(2);
    const [log, setLog] = useState([]);
    const [gantt, setGantt] = useState([]);

    const intervalRef = useRef(null);
    const runningRef = useRef(false);

    // refs for latest state to avoid stale closures
    const processesRef = useRef(processes);
    const readyRef = useRef(readyQueue);
    const blockedRef = useRef(blockedQueues);
    const resourcesRef = useRef(resources);
    const cpuRef = useRef(cpu);
    const timeRef = useRef(time);

    useEffect(() => {
        processesRef.current = processes;
    }, [processes]);
    useEffect(() => {
        readyRef.current = readyQueue;
    }, [readyQueue]);
    useEffect(() => {
        blockedRef.current = blockedQueues;
    }, [blockedQueues]);
    useEffect(() => {
        resourcesRef.current = resources;
    }, [resources]);
    useEffect(() => {
        cpuRef.current = cpu;
    }, [cpu]);
    useEffect(() => {
        timeRef.current = time;
    }, [time]);

    // Initialize at t=0: move all to ready
    useEffect(() => {
        setProcesses((ps) => ps.map((p) => ({ ...p, state: 'ready' })));
        setReadyQueue(processes.map((p) => p.id));
        setLog((l) => [
            ...l,
            `T=0: ${processes.map((p) => `${p.id} (priority=${p.priority})`).join(', ')} tiba, masuk Ready Queue.`,
        ]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Helpers
    const findProc = (id) => processesRef.current.find((p) => p.id === id);

    const enqueueReady = useCallback((id, note) => {
        setProcesses((ps) => ps.map((p) => (p.id === id ? { ...p, state: 'ready' } : p)));
        setReadyQueue((q) => (q.includes(id) ? q : [...q, id]));
        if (note) setLog((l) => [...l, `T=${timeRef.current}: ${note}`]);
    }, []);

    const blockOn = useCallback((id, r) => {
        setProcesses((ps) => ps.map((p) => (p.id === id ? { ...p, state: 'blocked' } : p)));
        setBlockedQueues((bq) => ({ ...bq, [r]: [...bq[r], id] }));
        setLog((l) => [...l, `T=${timeRef.current}: ${id} meminta Resource ${r} -> dipindahkan ke Blocked Queue (${r}).`] );
    }, []);

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

    const pickFromReady = useCallback(() => {
        const rq = readyRef.current;
        if (!rq || rq.length === 0) return null;
        if (algorithm === 'FCFS') return rq[0];
        if (algorithm === 'PRIORITY') {
            const sorted = [...rq].sort((a, b) => {
                const pa = findProc(a)?.priority ?? 99;
                const pb = findProc(b)?.priority ?? 99;
                return pa - pb;
            });
            return sorted[0];
        }
        if (algorithm === 'RR') return rq[0];
        return rq[0];
    }, [algorithm]);

    const snapshotGantt = useCallback(() => {
        const entries = {};
        processesRef.current.forEach((p) => (entries[p.id] = p.state));
        if (cpuRef.current.running) entries[cpuRef.current.running] = 'running';
        setGantt((g) => [...g, { t: timeRef.current, entries }]);
    }, []);

    // One simulation step (tick)
    const stepSimulation = useCallback(() => {
        // advance time
        setTime((t) => t + 1);

        // operate on CPU
        const cpuNow = cpuRef.current;
        if (!cpuNow.running) {
            // schedule
            const pick = pickFromReady();
            if (pick) {
                // remove from ready
                setReadyQueue((rq) => rq.filter((x) => x !== pick));
                const p = findProc(pick);
                // determine next instruction
                const inst = p.instructions[p.ip];
                if (inst && inst.type === 'CPU') {
                    // set running with either full CPU duration or quantum (for RR)
                    let runLen = inst.duration;
                    if (algorithm === 'RR') runLen = Math.min(runLen, quantum);
                    setCpu({ running: pick, remaining: runLen });
                    setProcesses((ps) => ps.map((pr) => (pr.id === pick ? { ...pr, state: 'running', remaining: runLen } : pr)));
                    setLog((l) => [...l, `T=${timeRef.current}: Penjadwal memilih ${pick} untuk dieksekusi.`]);
                } else {
                    // No CPU instruction at ip -> try to advance/handle non-CPU
                    // handle in a small loop below by setting process state to ready and letting next ticks handle it
                    enqueueReady(pick, `${pick} masuk Ready Queue (instruksi bukan CPU).`);
                }
            }
        } else {
            // CPU is running
            setCpu((c) => {
                const remaining = c.remaining - 1;
                if (remaining > 0) return { ...c, remaining };
                // completed current time slice or CPU burst
                const pid = c.running;
                const p = findProc(pid);
                // advance ip if current instruction was CPU
                const curInst = p.instructions[p.ip];
                let nextIp = p.ip;
                if (curInst && curInst.type === 'CPU') nextIp = p.ip + 1;

                const nextInst = p.instructions[nextIp];

                // update process ip and set to idle temporarily
                setProcesses((ps) => ps.map((pr) => (pr.id === pid ? { ...pr, ip: nextIp, remaining: 0, state: 'idle' } : pr)));
                setLog((l) => [...l, `T=${timeRef.current + 1}: ${pid} menyelesaikan CPU burst.`]);

                // handle next instruction
                if (!nextInst || nextInst.type === 'END') {
                    setProcesses((ps) => ps.map((pr) => (pr.id === pid ? { ...pr, state: 'finished' } : pr)));
                    setLog((l) => [...l, `T=${timeRef.current + 1}: ${pid} selesai.`]);
                    return { running: null, remaining: 0 };
                }

                if (nextInst.type === 'LOCK') {
                    const r = nextInst.resource;
                    if (!resourcesRef.current[r]) {
                        // resource free: lock immediately
                        setResources((res) => ({ ...res, [r]: pid }));
                        // advance ip to after LOCK and enqueue to ready for next CPU
                        setProcesses((ps) => ps.map((pr) => (pr.id === pid ? { ...pr, ip: nextIp + 1, state: 'ready' } : pr)));
                        setReadyQueue((rq) => [...rq, pid]);
                        setLog((l) => [...l, `T=${timeRef.current + 1}: Resource ${r} bebas. ${pid} meng-LOCK Resource ${r}.`]);
                    } else {
                        // resource held: block the process
                        blockOn(pid, r);
                    }
                    return { running: null, remaining: 0 };
                }

                if (nextInst.type === 'UNLOCK') {
                    const r = nextInst.resource;
                    setResources((res) => {
                        const newRes = { ...res, [r]: null };
                        setLog((l) => [...l, `T=${timeRef.current + 1}: ${pid} melakukan UNLOCK Resource ${r}.`]);
                        // wake first blocked waiter for r
                        tryWake(r);
                        return newRes;
                    });
                    // advance ip and enqueue ready
                    setProcesses((ps) => ps.map((pr) => (pr.id === pid ? { ...pr, ip: nextIp + 1, state: 'ready' } : pr)));
                    setReadyQueue((rq) => [...rq, pid]);
                    return { running: null, remaining: 0 };
                }

                if (nextInst.type === 'CPU') {
                    // enqueue for next CPU burst
                    setProcesses((ps) => ps.map((pr) => (pr.id === pid ? { ...pr, state: 'ready', ip: nextIp } : pr)));
                    setReadyQueue((rq) => [...rq, pid]);
                    return { running: null, remaining: 0 };
                }

                return { running: null, remaining: 0 };
            });
        }

        // snapshot gantt after actions
        snapshotGantt();
    }, [pickFromReady, enqueueReady, blockOn, tryWake, algorithm, quantum, snapshotGantt]);

    // start / pause
    const startSimulation = useCallback(() => {
        if (intervalRef.current) return;
        runningRef.current = true;
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
        setProcesses(defaultProcs.map((p) => ({ ...p, ip: 0, remaining: 0, state: 'ready' })));
        setReadyQueue(defaultProcs.map((p) => p.id));
        setBlockedQueues({ A: [], B: [] });
        setResources({ A: null, B: null });
        setCpu({ running: null, remaining: 0 });
        setLog([]);
        setGantt([]);
        }, [pauseSimulation, defaultProcs]);

    // expose API
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
    };
}

export default useScheduler;