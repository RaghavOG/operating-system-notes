# Deadlocks - Fundamentals

## Quick Reference (TL;DR)

**Deadlock**: Circular waiting where processes/threads are blocked waiting for resources held by each other. All are stuck, none can proceed.

**Necessary Conditions**: Mutual exclusion, Hold and wait, No preemption, Circular wait. All must be present.

**Handling**: Prevention (break conditions), Avoidance (Banker's algorithm), Detection (find cycles), Recovery (kill processes).

**Banker's Algorithm**: Determines if system is in safe state. Safe ≠ deadlock, but unsafe can lead to deadlock.

---

## 1. Clear Definition

A **deadlock** is a situation where two or more processes/threads are blocked forever, each waiting for a resource held by another process in the deadlock set.

**Example**:
```
Process A holds Lock 1, wants Lock 2
Process B holds Lock 2, wants Lock 1
→ Both blocked, deadlock!
```

---

## 2. Core Concepts

### Deadlock Definition

**Formal**: A set of processes is deadlocked if:
- Each process is waiting for a resource
- That resource is held by another process in the set
- Circular dependency exists

**Visual**:
```
Process A ──(wants)──> Lock 2 ──(held by)──> Process B
    ▲                                              │
    │                                              │
    └────────(holds Lock 1)◄──(wants)────────────┘
```

### Necessary Conditions (All Required)

**1. Mutual Exclusion**:
- Resources cannot be shared
- Only one process can hold resource at a time
- Example: Locks, mutexes

**2. Hold and Wait**:
- Process holds some resources
- While waiting for additional resources
- Example: Process has Lock 1, wants Lock 2

**3. No Preemption**:
- Resources cannot be forcibly taken
- Process must release voluntarily
- Example: Cannot steal lock from process

**4. Circular Wait**:
- Circular chain of waiting processes
- P1 waits for P2, P2 waits for P3, ..., Pn waits for P1
- Example: Circular dependency graph

**All four must be present** for deadlock to occur.

### Circular Wait Graph

**Representation**: Directed graph
- Nodes: Processes
- Edges: "Process A waits for resource held by Process B"

**Deadlock exists** if graph has cycle.

**Example**:
```
P1 ──(waits for R2)──> P2
P2 ──(waits for R3)──> P3
P3 ──(waits for R1)──> P1
→ Cycle = Deadlock!
```

**Detection**: Use cycle detection algorithm (DFS).

### Handling Strategies

**1. Prevention**: Break one of the necessary conditions
- **Mutual exclusion**: Make resources shareable (not always possible)
- **Hold and wait**: Acquire all resources at once (all-or-nothing)
- **No preemption**: Allow preemption (take resources away)
- **Circular wait**: Order resources (acquire in fixed order)

**2. Avoidance**: Check if granting request leads to unsafe state
- **Banker's algorithm**: Check safety before granting
- Requires knowing future resource needs
- More complex, but allows more concurrency

**3. Detection**: Periodically check for deadlocks
- Build wait-for graph
- Detect cycles
- If deadlock found, recover

**4. Recovery**: Break deadlock when detected
- **Process termination**: Kill one or more processes
- **Resource preemption**: Take resources away
- **Rollback**: Restore to safe state

### Banker's Algorithm

**Purpose**: Determine if system is in **safe state**.

**Safe State**: System can allocate resources in some order such that all processes can complete (no deadlock).

**Unsafe State**: System may deadlock (but not guaranteed).

**Key Insight**: **Safe ≠ deadlock**, but **unsafe can lead to deadlock**.

**Algorithm**:
1. Check if request can be granted (enough resources)
2. Pretend to grant request
3. Check if resulting state is safe
4. If safe, grant request; else, deny

**Safety Algorithm**:
1. Find process that can complete with available resources
2. Mark it as finished, add its resources to available
3. Repeat until all processes finish (safe) or none can proceed (unsafe)

**Example**:
```
Available: [3, 3, 2]
Processes:
  P0: Allocation=[0,1,0], Need=[7,4,3]
  P1: Allocation=[2,0,0], Need=[1,2,2]
  P2: Allocation=[3,0,2], Need=[6,0,0]
  P3: Allocation=[2,1,1], Need=[0,1,1]
  P4: Allocation=[0,0,2], Need=[4,3,1]

Check safety:
- P1 can complete (Need=[1,2,2] ≤ Available=[3,3,2])
- After P1: Available=[5,3,2]
- P3 can complete (Need=[0,1,1] ≤ Available=[5,3,2])
- After P3: Available=[7,4,3]
- P4 can complete...
→ Safe state!
```

### Why Unsafe ≠ Deadlock

**Unsafe State**: System may deadlock, but not guaranteed.

**Why**:
- Processes may release resources before requesting more
- Processes may terminate
- Deadlock requires all four conditions

**Example**:
```
Unsafe state exists
→ Process requests resource
→ If granted, may deadlock
→ But process might release resources first
→ No deadlock occurs
```

**Safe State**: Guaranteed no deadlock (can always find safe sequence).

### Deadlock vs Starvation

**Deadlock**:
- **All processes blocked**: None can proceed
- **Circular dependency**: Waiting for each other
- **Permanent**: Until broken

**Starvation**:
- **Some processes blocked**: Others can proceed
- **No circular dependency**: Just low priority
- **Temporary**: May eventually get resources

**Example**:
- **Deadlock**: P1 waits for P2, P2 waits for P1 (both stuck)
- **Starvation**: Low-priority process never gets CPU (others do)

### Why Deadlocks Are Rare in Modern OS

**Reasons**:
1. **Few shared resources**: Most resources are process-private
2. **Short lock hold times**: Locks held briefly
3. **Timeout mechanisms**: Locks have timeouts
4. **Lock ordering**: Developers follow conventions
5. **Detection tools**: Static analysis, runtime detection

**But still possible**: Especially with multiple locks, complex systems.

### Why Timeouts Are Practical Deadlock Handling

**Mechanism**: If lock acquisition takes too long, assume deadlock and abort.

**Advantages**:
✅ Simple to implement  
✅ Works in practice  
✅ No need for complex detection

**Disadvantages**:
❌ May abort non-deadlocked processes  
❌ Timeout value is arbitrary

**Example**:
```c
if (pthread_mutex_timedlock(&lock, &timeout) == ETIMEDOUT) {
    // Assume deadlock, abort or retry
}
```

---

## 3. Use Cases

### When Deadlocks Occur

- Multiple locks acquired in different orders
- Database transactions
- Resource allocation systems
- Complex multi-threaded applications

---

## 4. Advantages & Disadvantages

### Prevention

**Advantages**:
✅ Prevents deadlocks  
✅ Simple (break conditions)

**Disadvantages**:
❌ Reduces concurrency  
❌ May be inefficient

### Avoidance

**Advantages**:
✅ Allows more concurrency  
✅ Prevents deadlocks

**Disadvantages**:
❌ Complex (Banker's algorithm)  
❌ Requires future knowledge

### Detection & Recovery

**Advantages**:
✅ Maximum concurrency  
✅ Flexible

**Disadvantages**:
❌ Overhead (periodic checks)  
❌ Recovery is complex

---

## 5. Best Practices

1. **Lock ordering**: Always acquire locks in same order
2. **Timeout locks**: Use timeouts to detect deadlocks
3. **Minimize locks**: Fewer locks = less deadlock risk
4. **Lock-free algorithms**: When possible

---

## 6. Common Pitfalls

⚠️ **Mistake**: Acquiring locks in different orders

⚠️ **Mistake**: Not understanding safe vs unsafe state

⚠️ **Mistake**: Confusing deadlock with starvation

---

## 7. Interview Tips

**Common Questions**:
1. "What is a deadlock?"
2. "What are the necessary conditions?"
3. "Explain Banker's algorithm."
4. "Why is unsafe state not deadlock?"

**Key Points**:
- Four necessary conditions
- Circular wait graph
- Safe vs unsafe state
- Prevention vs avoidance vs detection

---

## 8. Related Topics

- **Synchronization Primitives** (Topic 9): Locks that can deadlock
- **CPU Scheduling** (Topic 7): Starvation (different from deadlock)

---

## 9. Visual Aids

### Deadlock Graph

```
    P1 ──(waits)──> P2
     ▲                │
     │                │
     └──(waits)─── P3 ┘
     (circular wait = deadlock)
```

### Safe vs Unsafe State

```
Safe State:
  Can find sequence: P1 → P2 → P3 → P4
  All processes can complete
  No deadlock possible

Unsafe State:
  No safe sequence exists
  May deadlock (but not guaranteed)
  Depends on future requests
```

---

## 10. Quick Reference Summary

**Deadlock**: Circular waiting, all blocked

**Necessary Conditions**: Mutual exclusion, Hold and wait, No preemption, Circular wait

**Handling**: Prevention, Avoidance, Detection, Recovery

**Banker's Algorithm**: Checks safe state (safe ≠ deadlock)

**Timeouts**: Practical deadlock handling

