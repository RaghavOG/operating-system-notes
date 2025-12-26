# Thread Models - User-level, Kernel-level, M:N

## Quick Reference (TL;DR)

**User-level Threads**: Managed by library/runtime. Multiple user threads map to one kernel thread. Fast switching, but no true parallelism.

**Kernel-level Threads**: Managed by OS. Each user thread = one kernel thread. True parallelism, but slower switching.

**M:N Model**: M user threads map to N kernel threads. Balance of both. Used by Go (before 1.1), some other systems.

---

## 1. Clear Definition

### User-level Threads (Green Threads)
Threads managed entirely in **user space** by a library or runtime. The OS kernel is unaware of these threads. Multiple user-level threads are multiplexed onto a single kernel thread.

### Kernel-level Threads
Threads managed by the **OS kernel**. Each user-level thread corresponds to one kernel-level thread. The OS scheduler manages these threads.

### M:N Threading Model
A **hybrid model** where M user-level threads are mapped to N kernel-level threads (where M > N). The runtime/library manages user threads, while the OS manages kernel threads.

---

## 2. Core Concepts

### User-level Threads

**Characteristics**:
- Managed by library/runtime (not OS)
- OS sees only one process/thread
- Context switching in user space (no system call)
- Cannot use multiple CPU cores (all map to one kernel thread)

**Advantages**:
✅ **Fast switching**: No system call, no kernel involvement  
✅ **Custom scheduling**: Library can implement custom algorithms  
✅ **Portable**: Works on systems without kernel threads  
✅ **Low overhead**: No kernel resources per thread

**Disadvantages**:
❌ **No parallelism**: All threads run on one CPU core  
❌ **Blocking problem**: One blocking thread blocks all  
❌ **No preemption**: Library must yield voluntarily

**Example**: Go goroutines (before Go 1.1), early Java threads

### Kernel-level Threads

**Characteristics**:
- Managed by OS kernel
- Each thread is schedulable entity
- OS scheduler manages threads
- Can use multiple CPU cores

**Advantages**:
✅ **True parallelism**: Threads can run on different cores  
✅ **Preemption**: OS can preempt threads  
✅ **Blocking**: One thread blocking doesn't block others  
✅ **OS awareness**: Kernel knows about all threads

**Disadvantages**:
❌ **Slower switching**: System call overhead  
❌ **More resources**: Each thread uses kernel resources  
❌ **Less control**: OS controls scheduling

**Example**: pthreads (POSIX threads), Windows threads, modern Go

### M:N Threading Model

**Characteristics**:
- M user threads mapped to N kernel threads
- Runtime manages user threads
- OS manages kernel threads
- Balance between both approaches

**Advantages**:
✅ **Parallelism**: Can use multiple cores (N kernel threads)  
✅ **Fast switching**: User-level switching when possible  
✅ **Flexibility**: Can adjust M:N ratio

**Disadvantages**:
❌ **Complexity**: Most complex to implement  
❌ **Scheduling complexity**: Two-level scheduling  
❌ **Blocking issues**: Still has blocking problems

**Example**: Go (before 1.1), some other systems

### Comparison Table

| Aspect | User-level | Kernel-level | M:N |
|--------|------------|--------------|-----|
| **Management** | Library | OS | Both |
| **Switching Speed** | Very Fast | Slower | Fast (user) |
| **Parallelism** | No | Yes | Yes (limited) |
| **Blocking** | Blocks all | Blocks one | Complex |
| **Resources** | Low | High | Medium |
| **Complexity** | Low | Medium | High |

---

## 3. Use Cases

### User-level Threads

- **I/O-bound applications**: Many threads, mostly waiting
- **Legacy systems**: Systems without kernel thread support
- **Custom scheduling**: Need specific scheduling behavior

### Kernel-level Threads

- **CPU-bound applications**: Need true parallelism
- **Modern systems**: Standard approach today
- **Multi-core utilization**: Need to use all cores

### M:N Model

- **Mixed workloads**: Both I/O and CPU bound
- **High concurrency**: Many threads, fewer cores
- **Performance-critical**: Need both speed and parallelism

---

## 4. Advantages & Disadvantages

See comparison table above.

---

## 5. Best Practices

1. **Use kernel threads**: Standard, well-supported
2. **Consider workload**: I/O-bound vs CPU-bound
3. **Understand model**: Know what your runtime uses
4. **Profile**: Measure actual performance

---

## 6. Common Pitfalls

⚠️ **Mistake**: Assuming user threads provide parallelism

⚠️ **Mistake**: Not understanding blocking behavior

⚠️ **Mistake**: Confusing thread models

---

## 7. Interview Tips

**Common Questions**:
1. "Compare user-level vs kernel-level threads."
2. "What's the M:N model?"
3. "When would you use each?"

**Key Points**:
- User-level: Fast, no parallelism
- Kernel-level: Slower, true parallelism
- M:N: Balance of both

---

## 8. Related Topics

- **Threads** (Topic 6): Thread fundamentals
- **CPU Scheduling** (Topic 7): How threads are scheduled

---

## 9. Visual Aids

### User-level Threads (1:1 mapping to kernel thread)

```
User Space
┌──────────┐
│Thread 1  │
│Thread 2  │──┐
│Thread 3  │  │
└──────────┘  │
              │ (all map to)
              ▼
Kernel Space  │
┌──────────┐  │
│Kernel    │◄─┘
│Thread 1  │
└──────────┘
```

### Kernel-level Threads (1:1 mapping)

```
User Space        Kernel Space
┌──────────┐      ┌──────────┐
│Thread 1  │─────>│Kernel    │
│Thread 2  │─────>│Thread 1  │
│Thread 3  │─────>│Kernel    │
└──────────┘      │Thread 2  │
                  │Kernel    │
                  │Thread 3  │
                  └──────────┘
```

### M:N Model

```
User Space        Kernel Space
┌──────────┐      ┌──────────┐
│Thread 1  │      │Kernel    │
│Thread 2  │──┐   │Thread 1  │
│Thread 3  │  │   │          │
│Thread 4  │──┼──>│Kernel    │
│Thread 5  │  │   │Thread 2  │
│Thread 6  │──┘   │          │
└──────────┘      └──────────┘
(M=6, N=2)
```

---

## 10. Quick Reference Summary

**User-level**: Library-managed, fast switching, no parallelism

**Kernel-level**: OS-managed, slower switching, true parallelism

**M:N**: Hybrid, balance of both approaches

**Modern trend**: Kernel-level threads (standard today)

