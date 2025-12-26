# Final FAANG Filter Questions

## Quick Reference (TL;DR)

**Why OS design is about compromises**: Conflicting goals (performance vs safety, fairness vs throughput). No perfect solutions, only trade-offs.

**Why abstractions leak**: Hardware details show through (cache behavior, NUMA, page size). Abstractions can't hide everything.

**Why OS can never be fully secure**: Complexity, bugs, new attack vectors. Security is ongoing process, not destination.

**Why performance tuning breaks correctness**: Optimizations (reordering, caching) can break assumptions. Must balance performance and correctness.

**Why distributed systems resemble OS problems**: Resource management, consistency, fault tolerance. Similar principles apply.

---

## 1. Clear Definition

**FAANG Filter Questions** are high-level, philosophical questions that test deep understanding of OS principles and trade-offs. These separate senior engineers from junior ones.

---

## 2. Core Concepts

### Why OS Design is About Compromises

**Conflicting Goals**:
- **Performance vs Safety**: Fast (monolithic) vs Safe (microkernel)
- **Fairness vs Throughput**: Fair (round-robin) vs Efficient (SJF)
- **Latency vs Throughput**: Responsive (preemptive) vs Efficient (batch)
- **Simplicity vs Features**: Simple vs Feature-rich

**No Perfect Solutions**:
- Every design decision sacrifices one quality for another
- "Best" depends on use case
- Must understand trade-offs

**Example**:
- **Monolithic kernel**: Fast but less safe
- **Microkernel**: Safe but slower
- **Hybrid**: Balance of both (compromise)

**Key Insight**: OS design = understanding and making trade-offs.

### Why Abstractions Leak

**Definition**: Hardware details show through abstractions.

**Examples**:

1. **Cache Behavior**:
   - Abstraction: Uniform memory access
   - Reality: Cache misses are expensive
   - Leak: Performance depends on access pattern

2. **NUMA (Non-Uniform Memory Access)**:
   - Abstraction: Uniform memory
   - Reality: Local memory faster than remote
   - Leak: Performance depends on memory location

3. **Page Size**:
   - Abstraction: Just memory
   - Reality: Page size affects performance
   - Leak: TLB misses, fragmentation

4. **System Calls**:
   - Abstraction: Just function calls
   - Reality: Expensive (mode transitions)
   - Leak: Performance cost visible

**Why They Leak**:
- **Performance**: Abstractions add overhead
- **Hardware**: Can't hide all hardware details
- **Complexity**: Perfect abstraction is impossible

**Key Insight**: Abstractions simplify but can't hide everything.

### Why OS Can Never Be Fully Secure

**Reasons**:

1. **Complexity**:
   - Millions of lines of code
   - Many components (kernel, drivers, services)
   - Bugs are inevitable

2. **New Attack Vectors**:
   - New vulnerabilities discovered
   - New attack methods
   - Security is moving target

3. **Human Factor**:
   - Configuration errors
   - Social engineering
   - Insider threats

4. **Trade-offs**:
   - Security vs Usability
   - Security vs Performance
   - Perfect security = unusable system

5. **Kernel Privileges**:
   - Kernel bugs = full system compromise
   - Can't eliminate all bugs
   - Defense in depth helps but not perfect

**Approach**:
- **Defense in depth**: Multiple layers
- **Principle of least privilege**: Minimize access
- **Continuous improvement**: Patch, update, monitor
- **Assume breach**: Plan for compromise

**Key Insight**: Security is process, not destination.

### Why Performance Tuning Breaks Correctness

**Optimizations That Break Correctness**:

1. **Instruction Reordering**:
   - CPU/compiler reorders for performance
   - Breaks: Assumptions about order
   - Fix: Memory barriers

2. **Caching**:
   - CPU caches hide writes
   - Breaks: Visibility assumptions
   - Fix: Cache coherence, memory barriers

3. **Speculative Execution**:
   - CPU executes ahead
   - Breaks: Side effects visible
   - Fix: Rollback on misprediction

4. **Compiler Optimizations**:
   - Optimizations change code
   - Breaks: Assumptions about execution
   - Fix: Volatile, barriers

**Example**:
```c
// Without synchronization:
flag = true;
data = 42;

// Optimized (reordered):
data = 42;  // May execute first
flag = true;

// Other thread sees flag=true but data may not be 42!
```

**Balance**:
- **Performance**: Fast execution
- **Correctness**: Guaranteed behavior
- **Trade-off**: Must balance both

**Key Insight**: Optimizations assume single-threaded, break in concurrent code.

### Why Distributed Systems Resemble OS Problems

**Similar Problems**:

1. **Resource Management**:
   - **OS**: CPU, memory, I/O
   - **Distributed**: Servers, network, storage
   - **Principle**: Allocate fairly, efficiently

2. **Consistency**:
   - **OS**: Memory consistency (cache coherence)
   - **Distributed**: Data consistency (replication)
   - **Principle**: Keep data consistent

3. **Fault Tolerance**:
   - **OS**: Process crashes, hardware failures
   - **Distributed**: Node failures, network partitions
   - **Principle**: Handle failures gracefully

4. **Scheduling**:
   - **OS**: CPU scheduling
   - **Distributed**: Load balancing, task scheduling
   - **Principle**: Fair, efficient allocation

5. **Isolation**:
   - **OS**: Process isolation
   - **Distributed**: Service isolation
   - **Principle**: Faults don't propagate

**Key Insight**: Same principles, different scale.

---

## 3. Use Cases

These questions test:
- Deep understanding
- Systems thinking
- Trade-off analysis
- Senior-level reasoning

---

## 4. Advantages & Disadvantages

Understanding these principles helps:
- Make better design decisions
- Understand system behavior
- Debug complex issues
- Reason about trade-offs

---

## 5. Best Practices

1. **Think in trade-offs**: No perfect solutions
2. **Understand abstractions**: Know what they hide
3. **Assume insecurity**: Defense in depth
4. **Balance performance/correctness**: Both matter
5. **Apply principles broadly**: OS → Distributed systems

---

## 6. Common Pitfalls

⚠️ **Mistake**: Thinking there are perfect solutions

⚠️ **Mistake**: Ignoring abstraction leaks

⚠️ **Mistake**: Assuming perfect security

⚠️ **Mistake**: Optimizing without considering correctness

---

## 7. Interview Tips

**Common Questions**:
1. "Why is OS design about compromises?"
2. "Why do abstractions leak?"
3. "Can an OS be fully secure?"
4. "Why does performance tuning break correctness?"
5. "How are distributed systems like OS?"

**Answer Approach**:
1. **Acknowledge complexity**: No simple answers
2. **Explain trade-offs**: Show understanding
3. **Give examples**: Concrete illustrations
4. **Show reasoning**: Demonstrate thinking

---

## 8. Related Topics

All topics covered in previous sections.

---

## 9. Visual Aids

### Trade-off Triangle

```
        Performance
           /\
          /  \
         /    \
        /      \
   Safety ──── Features
```

### Abstraction Leakage

```
Application
    │
    │ (thinks uniform)
    ▼
OS Abstraction
    │
    │ (leaks through)
    ▼
Hardware Reality
```

---

## 10. Quick Reference Summary

**Compromises**: No perfect solutions, only trade-offs

**Abstractions Leak**: Hardware details show through

**Security**: Ongoing process, never perfect

**Performance vs Correctness**: Must balance both

**Distributed = OS**: Same principles, different scale

**Key Insight**: Understanding these shows senior-level thinking.

