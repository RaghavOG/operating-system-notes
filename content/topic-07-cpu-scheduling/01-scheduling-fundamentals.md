# CPU Scheduling - Fundamentals

## Quick Reference (TL;DR)

**CPU Scheduling**: Deciding which process/thread runs on CPU. Goals: Fairness, Throughput, Latency, Response Time. Preemptive (OS can interrupt) vs Non-preemptive (process yields).

**Key Metrics**: Turnaround time, Waiting time, Response time, Throughput, CPU utilization.

**Trade-offs**: Fairness vs Throughput, Latency vs Throughput, Preemptive vs Non-preemptive.

---

## 1. Clear Definition

**CPU Scheduling** is the process of selecting which process or thread should run on the CPU at any given time. The OS scheduler makes these decisions based on scheduling algorithms and policies.

**Purpose**: 
- Multiplex CPU among multiple processes/threads
- Ensure fairness
- Maximize throughput
- Minimize latency
- Keep CPU busy

---

## 2. Core Concepts

### Scheduling Goals

**Conflicting Goals** (trade-offs):

1. **Fairness**: All processes get equal CPU time
   - Round-robin provides fairness
   - But may hurt throughput

2. **Throughput**: Maximize processes completed per unit time
   - Shortest-job-first maximizes throughput
   - But may starve long jobs

3. **Latency**: Minimize time from request to start
   - Preemptive scheduling helps
   - But adds overhead

4. **Response Time**: Minimize time to first response
   - Important for interactive systems
   - May hurt throughput

5. **CPU Utilization**: Keep CPU busy
   - Important for batch systems
   - Less important for interactive

**No perfect scheduler**: Must balance these goals.

### Preemptive vs Non-preemptive

**Preemptive Scheduling**:
- OS can **interrupt** running process
- Timer interrupt triggers preemption
- Process doesn't voluntarily yield
- Better for interactive systems

**Example**: Round-robin, priority preemptive

**Non-preemptive Scheduling**:
- Process runs until it **voluntarily yields**
- Process blocks (I/O) or terminates
- Simpler, but less responsive
- Better for batch systems

**Example**: First-come-first-served (FCFS)

**Comparison**:
| Aspect | Preemptive | Non-preemptive |
|--------|------------|----------------|
| **Responsiveness** | High | Low |
| **Overhead** | Higher | Lower |
| **Fairness** | Better | Worse |
| **Complexity** | Higher | Lower |

### Fairness vs Throughput vs Latency

**Fairness**:
- All processes treated equally
- Example: Round-robin
- Trade-off: May run inefficient jobs

**Throughput**:
- Maximize jobs completed
- Example: Shortest-job-first
- Trade-off: May starve long jobs

**Latency**:
- Minimize waiting time
- Example: Preemptive priority
- Trade-off: More context switches

**Real-world**: Modern schedulers balance all three.

### CPU Affinity

**Definition**: Binding a process/thread to specific CPU cores.

**Why**:
- **Cache locality**: Keep process on same core (warm cache)
- **NUMA**: Keep process near its memory
- **Reduced migration**: Less overhead

**Types**:
- **Soft affinity**: Hint to scheduler (preferred)
- **Hard affinity**: Mandatory binding

**Example**:
```c
// Set CPU affinity (Linux)
cpu_set_t set;
CPU_ZERO(&set);
CPU_SET(0, &set);  // Use CPU 0
sched_setaffinity(0, sizeof(set), &set);
```

**Trade-off**: Better locality vs less flexibility.

---

## 3. Use Cases

### When Preemptive is Better

- Interactive systems (desktop, mobile)
- Real-time systems (meet deadlines)
- Multi-user systems (fairness)

### When Non-preemptive is Better

- Batch systems (throughput)
- Embedded systems (simplicity)
- Single-user systems

---

## 4. Advantages & Disadvantages

### Preemptive Scheduling

**Advantages**:
✅ Responsive  
✅ Fair  
✅ Prevents starvation

**Disadvantages**:
❌ More overhead  
❌ More complex  
❌ Cache effects

### Non-preemptive Scheduling

**Advantages**:
✅ Less overhead  
✅ Simpler  
✅ Better cache locality

**Disadvantages**:
❌ Less responsive  
❌ Can starve processes  
❌ Poor for interactive

---

## 5. Best Practices

1. **Choose based on workload**: Interactive vs batch
2. **Balance goals**: No single metric
3. **Consider overhead**: Context switches cost
4. **Profile**: Measure actual performance

---

## 6. Common Pitfalls

⚠️ **Mistake**: Optimizing for one metric only

⚠️ **Mistake**: Ignoring overhead

⚠️ **Mistake**: Not understanding trade-offs

---

## 7. Interview Tips

**Common Questions**:
1. "What are scheduling goals?"
2. "Compare preemptive vs non-preemptive."
3. "Explain fairness vs throughput trade-off."

**Key Points**:
- Multiple conflicting goals
- Preemptive = interruptible
- Trade-offs everywhere

---

## 8. Related Topics

- **Process Management** (Topic 5): What gets scheduled
- **Threads** (Topic 6): Thread scheduling
- **CPU Scheduling Algorithms** (Topic 7): How scheduling works

---

## 9. Visual Aids

### Scheduling Goals Trade-off

```
        Fairness
          ↑
          │
          │     Throughput
          │        ●
          │
          │              Latency
          │                 ●
          └──────────────────────→
```

### Preemptive vs Non-preemptive

**Preemptive**:
```
Process A ──[timer]──> Process B ──[timer]──> Process A
(interrupted)          (interrupted)
```

**Non-preemptive**:
```
Process A ──────────────> (blocks) ──> Process B ────────────>
(completes or blocks)                  (completes or blocks)
```

---

## 10. Quick Reference Summary

**Scheduling Goals**: Fairness, Throughput, Latency (conflicting)

**Preemptive**: OS can interrupt (responsive)

**Non-preemptive**: Process yields (simple)

**Trade-offs**: No perfect scheduler, must balance goals

