# CPU Scheduling Algorithms

## Quick Reference (TL;DR)

**FCFS**: First-come-first-served. Simple, non-preemptive. Convoy effect problem.

**SJF/SRTF**: Shortest job first (non-preemptive) / Shortest remaining time first (preemptive). Optimal for throughput, but requires future knowledge.

**Priority**: Schedule by priority. Can starve low-priority processes.

**Round Robin**: Time-sliced, preemptive. Fair, good for interactive. Time quantum matters.

**Multilevel Queue**: Separate queues for different process types.

**Multilevel Feedback Queue**: Processes move between queues based on behavior. Most complex, most flexible.

---

## 1. Clear Definition

**Scheduling Algorithms** determine the order in which processes/threads are selected to run on the CPU. Different algorithms optimize for different goals (fairness, throughput, latency).

---

## 2. Core Concepts

### FCFS (First-Come-First-Served)

**How it works**:
- Processes served in arrival order
- Non-preemptive (runs until completion or block)
- Simple queue (FIFO)

**Example**:
```
Arrival: P1(t=0, burst=10), P2(t=1, burst=4), P3(t=2, burst=3)

Timeline:
0────10────14────17
P1    P2    P3

Waiting times: P1=0, P2=9, P3=12
Average: (0+9+12)/3 = 7
```

**Advantages**:
✅ Simple  
✅ Fair (in arrival order)

**Disadvantages**:
❌ Convoy effect (long job blocks short jobs)  
❌ Poor average waiting time  
❌ Not responsive

**Convoy Effect**: Long process holds CPU, short processes wait behind it.

### SJF / SRTF

**SJF (Shortest Job First)** - Non-preemptive:
- Always run shortest available job
- Non-preemptive (runs to completion)

**SRTF (Shortest Remaining Time First)** - Preemptive:
- Always run job with shortest remaining time
- Preemptive (can interrupt)

**Example**:
```
Arrival: P1(t=0, burst=8), P2(t=1, burst=4), P3(t=2, burst=2)

SRTF Timeline:
0──1──3──7──15
P1 P3 P2 P1

Waiting times: P1=7, P2=2, P3=0
Average: (7+2+0)/3 = 3
```

**Advantages**:
✅ **Optimal** for average waiting time  
✅ Good throughput

**Disadvantages**:
❌ Requires future knowledge (burst times)  
❌ Can starve long jobs  
❌ Hard to predict burst times

**Why SJF is optimal yet unusable**:
- **Optimal**: Mathematically minimizes average waiting time
- **Unusable**: Requires knowing future (burst times)
- **Reality**: Can estimate, but not perfect

### Priority Scheduling

**How it works**:
- Each process has priority
- Always run highest priority process
- Can be preemptive or non-preemptive

**Example**:
```
Processes: P1(priority=3), P2(priority=1), P3(priority=2)
Run order: P2 (highest priority=1), P3, P1
```

**Advantages**:
✅ Flexible (can set priorities)  
✅ Good for real-time systems

**Disadvantages**:
❌ **Starvation**: Low-priority processes may never run  
❌ Priority inversion (low-priority holds high-priority resource)

**Aging**: Increase priority of waiting processes to prevent starvation.

### Round Robin

**How it works**:
- Each process gets time quantum (time slice)
- Preemptive (timer interrupts)
- Circular queue

**Example** (quantum=4):
```
Processes: P1(burst=8), P2(burst=4), P3(burst=2)

Timeline:
0──4──8──12──14
P1 P2 P1 P3

Waiting times: P1=4, P2=0, P3=10
Average: (4+0+10)/3 = 4.67
```

**Advantages**:
✅ Fair (everyone gets time)  
✅ Responsive  
✅ No starvation

**Disadvantages**:
❌ Context switch overhead  
❌ Performance depends on quantum size

**Effect of time quantum**:
- **Too small**: Too many context switches (overhead)
- **Too large**: Approaches FCFS (not responsive)
- **Optimal**: Balance (typically 10-100 ms)

### Multilevel Queue

**How it works**:
- Multiple queues (one per process type)
- Each queue has its own scheduling algorithm
- Processes assigned to queue based on type
- Queue priority (higher priority queue runs first)

**Example**:
```
Queue 1 (System): FCFS, high priority
Queue 2 (Interactive): Round-robin, medium priority
Queue 3 (Batch): FCFS, low priority
```

**Advantages**:
✅ Different algorithms for different types  
✅ Flexible

**Disadvantages**:
❌ Rigid (processes don't move between queues)  
❌ Can starve low-priority queues

### Multilevel Feedback Queue (MLFQ)

**How it works**:
- Multiple queues with different priorities
- Processes **move between queues** based on behavior
- CPU-bound processes move to lower priority
- I/O-bound processes move to higher priority

**Example**:
```
Queue 1 (highest): Quantum=8ms, Round-robin
Queue 2: Quantum=16ms, Round-robin
Queue 3 (lowest): FCFS

Process starts in Queue 1
- If uses full quantum → CPU-bound → move to Queue 2
- If blocks quickly → I/O-bound → stay in Queue 1
```

**Advantages**:
✅ Adapts to process behavior  
✅ I/O-bound get priority (responsive)  
✅ CPU-bound don't starve (lower priority but still run)

**Disadvantages**:
❌ Complex to implement  
❌ Many parameters to tune

**Why modern schedulers avoid strict priority**:
- Strict priority can starve low-priority processes
- Modern schedulers use **proportional sharing** (CFS)
- Fairness is important

---

## 3. Use Cases

### FCFS
- Batch systems
- Simple systems

### SJF/SRTF
- Batch systems (when burst times known)
- Throughput optimization

### Priority
- Real-time systems
- Systems with clear priority levels

### Round Robin
- Interactive systems
- Time-sharing systems
- General-purpose OS

### Multilevel Queue
- Systems with distinct process types
- Mixed workloads

### MLFQ
- General-purpose OS (Linux, Windows)
- Mixed workloads (I/O and CPU bound)

---

## 4. Advantages & Disadvantages

See algorithm descriptions above.

---

## 5. Best Practices

1. **Choose based on workload**: Interactive vs batch
2. **Tune parameters**: Time quantum, queue priorities
3. **Monitor**: Measure actual performance
4. **Balance**: No algorithm is perfect

---

## 6. Common Pitfalls

⚠️ **Mistake**: Using wrong algorithm for workload

⚠️ **Mistake**: Not tuning parameters (time quantum)

⚠️ **Mistake**: Ignoring starvation

---

## 7. Interview Tips

**Common Questions**:
1. "Compare FCFS, SJF, Round-robin."
2. "Why is SJF optimal yet unusable?"
3. "Explain multilevel feedback queue."
4. "What's the effect of time quantum in Round-robin?"

**Key Points**:
- Know each algorithm's characteristics
- Understand trade-offs
- Be able to calculate waiting times

---

## 8. Related Topics

- **CPU Scheduling Fundamentals** (Topic 7): Scheduling goals
- **Linux CFS** (Topic 7): Modern scheduler

---

## 9. Visual Aids

### Algorithm Comparison

| Algorithm | Avg Wait Time | Throughput | Responsiveness | Starvation |
|-----------|---------------|------------|----------------|------------|
| FCFS | High | Medium | Low | No |
| SJF | **Lowest** | **Highest** | Low | Yes |
| Round Robin | Medium | Medium | **High** | No |
| Priority | Variable | Variable | High | Yes |
| MLFQ | Low | High | High | No |

### Round Robin Time Quantum Effect

```
Small Quantum (2ms):
P1─P2─P3─P1─P2─P3─P1─P2─P3─...
(Many context switches, high overhead)

Large Quantum (100ms):
P1───────────P2───────────P3───────────...
(Few context switches, but less responsive)

Optimal Quantum (10-50ms):
P1───P2───P3───P1───P2───...
(Balance)
```

---

## 10. Quick Reference Summary

**FCFS**: Simple, convoy effect

**SJF/SRTF**: Optimal but requires future knowledge

**Round Robin**: Fair, responsive, quantum matters

**MLFQ**: Adapts to behavior, most flexible

**Trade-off**: No perfect algorithm, choose based on workload

