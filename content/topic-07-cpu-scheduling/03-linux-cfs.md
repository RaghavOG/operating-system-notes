# Linux CFS (Completely Fair Scheduler)

## Quick Reference (TL;DR)

**CFS**: Linux's default scheduler. Uses **virtual runtime** to ensure fairness. No strict priorities - uses **proportional sharing**. Red-black tree for O(log n) scheduling.

**Virtual Runtime**: Normalized CPU time. Processes with less virtual runtime run first. Ensures all processes get fair share over time.

**Why avoid strict priority**: Can starve low-priority processes. CFS uses nice values as hints, not strict priorities.

---

## 1. Clear Definition

**CFS (Completely Fair Scheduler)** is Linux's default process scheduler (since kernel 2.6.23). It aims to provide **fair CPU time allocation** to all processes using a **proportional sharing** approach rather than strict priorities.

💡 **Key Insight**: CFS doesn't use time slices. Instead, it tracks how much CPU time each process has received and ensures fairness over time.

---

## 2. Core Concepts

### Virtual Runtime

**Definition**: Normalized measure of how much CPU time a process has received, adjusted by the process's priority (nice value).

**Formula**:
```
virtual_runtime = actual_runtime * (1024 / weight)
```

Where `weight` is based on nice value (lower nice = higher weight).

**Purpose**: 
- Processes with **less virtual runtime** have received less CPU time
- CFS schedules process with **minimum virtual runtime** next
- Ensures fairness over time

**Example**:
```
Process A (nice=0, weight=1024): virtual_runtime = actual_runtime * 1.0
Process B (nice=5, weight=335): virtual_runtime = actual_runtime * 3.05

After 10ms CPU time:
- A: virtual_runtime = 10ms
- B: virtual_runtime = 30.5ms

CFS will schedule A next (lower virtual runtime)
```

### How CFS Works

**Data Structure**: Red-black tree (self-balancing BST)
- Key: virtual runtime
- Left child: Lower virtual runtime (scheduled sooner)
- Right child: Higher virtual runtime (scheduled later)

**Algorithm**:
1. Track virtual runtime for each process
2. Maintain red-black tree sorted by virtual runtime
3. Always schedule process with **minimum virtual runtime** (leftmost node)
4. Update virtual runtime when process runs
5. Reinsert process in tree

**Benefits**:
- O(log n) scheduling decision
- Fairness guaranteed over time
- No starvation

### Why Modern Schedulers Avoid Strict Priority

**Problems with Strict Priority**:
1. **Starvation**: Low-priority processes may never run
2. **Rigid**: Can't adapt to workload
3. **Unfair**: High-priority can monopolize CPU

**CFS Approach**:
- Uses **nice values** as hints (weight), not strict priorities
- All processes get CPU time (proportional to weight)
- Low-priority processes still run (just less frequently)
- Fairness over time, not instant

**Example**:
```
Strict Priority:
- High priority: Runs always
- Low priority: Never runs (starved)

CFS (Proportional):
- High priority (nice=-10): Gets ~75% CPU
- Low priority (nice=+10): Gets ~25% CPU
- Both run, but proportionally
```

---

## 3. Use Cases

- General-purpose Linux systems
- Servers (fair resource sharing)
- Desktop systems (responsive)

---

## 4. Advantages & Disadvantages

**Advantages**:
✅ Fair (no starvation)  
✅ Efficient (O(log n))  
✅ Adapts to workload  
✅ Proportional sharing

**Disadvantages**:
❌ Complex implementation  
❌ May not be optimal for all workloads

---

## 5. Best Practices

1. **Use nice values**: Adjust process priorities
2. **Monitor**: Check CPU usage per process
3. **Understand**: Know how CFS works

---

## 6. Common Pitfalls

⚠️ **Mistake**: Thinking nice values are strict priorities

⚠️ **Mistake**: Not understanding virtual runtime

---

## 7. Interview Tips

**Common Questions**:
1. "How does Linux CFS work?"
2. "What is virtual runtime?"
3. "Why does CFS avoid strict priority?"

**Key Points**:
- Virtual runtime for fairness
- Red-black tree for efficiency
- Proportional sharing, not strict priority

---

## 8. Related Topics

- **CPU Scheduling** (Topic 7): Scheduling fundamentals
- **Scheduling Algorithms** (Topic 7): Other algorithms

---

## 9. Visual Aids

### CFS Red-Black Tree

```
        [P3: vruntime=50]
       /                \
[P1: vruntime=20]    [P4: vruntime=80]
     /                      \
[P2: vruntime=10]      [P5: vruntime=100]

Schedule P2 next (minimum virtual runtime)
```

### Virtual Runtime Over Time

```
Virtual Runtime
    │
 100│                    ● High Priority
    │                  ●
  50│              ●
    │          ●
   0│      ● Low Priority
    └──────────────────→ Time
```

---

## 10. Quick Reference Summary

**CFS**: Fair scheduler using virtual runtime

**Virtual Runtime**: Normalized CPU time, ensures fairness

**Red-Black Tree**: O(log n) scheduling

**Proportional Sharing**: All processes get CPU time

