# Classic Comparison Questions

## Quick Reference (TL;DR)

**Process vs Thread**: Process = isolated address space, Thread = shared address space. Process context switch ~1-10 μs, Thread ~100-1000 ns.

**Mutex vs Semaphore**: Mutex = mutual exclusion (one thread), Semaphore = resource counting (N threads). Mutex has ownership, semaphore doesn't.

**Deadlock vs Starvation**: Deadlock = all blocked (circular), Starvation = some blocked (low priority). Deadlock permanent, starvation temporary.

**Paging vs Segmentation**: Paging = fixed size, Segmentation = variable size. Modern = paged segmentation.

**Kernel Thread vs User Thread**: Kernel = OS-managed, User = library-managed. Kernel = true parallelism, User = no parallelism (unless M:N).

---

## 1. Clear Definition

**Classic Comparison Questions** are fundamental distinctions that interviewers use to test deep understanding. These appear frequently in FAANG interviews.

---

## 2. Core Concepts

### Process vs Thread

| Aspect | Process | Thread |
|--------|---------|--------|
| **Address Space** | Isolated | Shared |
| **Memory** | Separate | Shared |
| **Context Switch** | ~1-10 μs | ~100-1000 ns |
| **Creation** | Expensive | Cheap |
| **Communication** | IPC (complex) | Shared memory (simple) |
| **Crash Impact** | Own process | Entire process |
| **Isolation** | Strong | Weak |
| **Use Case** | Isolation needed | Parallelism needed |

**Key Insight**: Process = isolation, Thread = parallelism within process.

### Mutex vs Semaphore

| Aspect | Mutex | Semaphore |
|--------|-------|-----------|
| **Purpose** | Mutual exclusion | Resource counting |
| **Value** | Binary (0/1) | Counting (0-N) |
| **Ownership** | Yes (only holder unlocks) | No |
| **Use Case** | Protect critical section | Limit resource access |
| **Reentrant** | Can be | No |

**Key Insight**: Mutex = one thread, Semaphore = N threads.

### Deadlock vs Starvation

| Aspect | Deadlock | Starvation |
|--------|----------|------------|
| **State** | All blocked | Some blocked |
| **Cause** | Circular wait | Low priority |
| **Permanence** | Permanent (until broken) | Temporary (may eventually get resource) |
| **Affected** | All in deadlock | Low-priority processes |
| **Solution** | Break cycle | Priority aging |

**Key Insight**: Deadlock = all stuck, Starvation = some stuck.

### Paging vs Segmentation

| Aspect | Paging | Segmentation |
|--------|--------|--------------|
| **Size** | Fixed | Variable |
| **Structure** | Arbitrary | Logical (code, data, stack) |
| **Fragmentation** | Internal | External |
| **Allocation** | Simple | Complex |
| **Protection** | Per page | Per segment |
| **Modern Use** | Primary | Combined with paging |

**Key Insight**: Modern = paged segmentation (segmentation for protection, paging for management).

### Kernel Thread vs User Thread

| Aspect | Kernel Thread | User Thread |
|--------|---------------|-------------|
| **Management** | OS kernel | Library/runtime |
| **Scheduling** | OS scheduler | Library scheduler |
| **Parallelism** | Yes (multiple cores) | No (one kernel thread) |
| **Context Switch** | System call | User space (fast) |
| **Blocking** | One thread blocks | All threads block |
| **OS Awareness** | Yes | No |

**Key Insight**: Kernel = OS-managed (parallelism), User = library-managed (no parallelism).

### Blocking vs Non-blocking

| Aspect | Blocking | Non-blocking |
|--------|----------|-------------|
| **Behavior** | Waits for operation | Returns immediately |
| **Thread State** | Blocked (sleeps) | Ready (continues) |
| **CPU Usage** | Gives up CPU | Keeps CPU |
| **Use Case** | I/O operations | Event loops |

**Key Insight**: Blocking = wait, Non-blocking = return immediately.

### Synchronous vs Asynchronous

| Aspect | Synchronous | Asynchronous |
|--------|-------------|--------------|
| **Execution** | Sequential | Concurrent |
| **Waiting** | Waits for completion | Continues, notified later |
| **Return** | Returns result | Returns immediately, callback later |

**Key Insight**: Synchronous = wait for result, Asynchronous = callback/notification.

### Spinlock vs Mutex

| Aspect | Spinlock | Mutex |
|--------|----------|-------|
| **Waiting** | Busy-wait (spins) | Blocks (sleeps) |
| **CPU Usage** | Wastes CPU | Gives up CPU |
| **Overhead** | Low (no context switch) | Higher (context switch) |
| **Use Case** | Short critical sections | Longer sections |
| **Contention** | Low | High |

**Key Insight**: Spinlock = busy-wait (fast for short), Mutex = block (efficient for long).

### Cache vs Buffer

| Aspect | Cache | Buffer |
|--------|-------|--------|
| **Purpose** | Speed up access | Smooth data flow |
| **Content** | Frequently used data | Temporary storage |
| **Lifecycle** | Persistent | Temporary |
| **Location** | Multiple levels | Single location |
| **Example** | CPU cache, file cache | I/O buffer, print buffer |

**Key Insight**: Cache = speed (frequently used), Buffer = flow (temporary storage).

### VM vs Container

| Aspect | Virtual Machine | Container |
|--------|-----------------|-----------|
| **Kernel** | Separate (each VM) | Shared (host) |
| **Isolation** | Strong | Weaker |
| **Overhead** | High | Low |
| **Startup** | Slow (minutes) | Fast (seconds) |
| **Use Case** | Different OSes, strong isolation | Same OS, efficiency |

**Key Insight**: VM = strong isolation, Container = efficiency.

---

## 3. Use Cases

These comparisons help choose the right approach for different scenarios.

---

## 4. Advantages & Disadvantages

See comparison tables above.

---

## 5. Best Practices

1. **Understand trade-offs**: Each has pros/cons
2. **Choose appropriately**: Based on requirements
3. **Know when to use each**: Context matters

---

## 6. Common Pitfalls

⚠️ **Mistake**: Confusing similar concepts

⚠️ **Mistake**: Not understanding trade-offs

⚠️ **Mistake**: Memorizing without understanding

---

## 7. Interview Tips

**Common Questions**:
- "Compare X vs Y" (any of the above)
- "When would you use X vs Y?"
- "What are the trade-offs?"

**Answer Structure**:
1. **Define both** clearly
2. **Compare key aspects** (table format)
3. **Explain trade-offs**
4. **Give use cases**

---

## 8. Related Topics

All topics covered in previous sections.

---

## 9. Visual Aids

See individual topic sections for diagrams.

---

## 10. Quick Reference Summary

**Key Comparisons**:
- Process vs Thread: Isolation vs Parallelism
- Mutex vs Semaphore: One vs N
- Deadlock vs Starvation: All vs Some
- Paging vs Segmentation: Fixed vs Variable
- Kernel vs User Thread: OS vs Library
- Blocking vs Non-blocking: Wait vs Return
- Synchronous vs Asynchronous: Sequential vs Concurrent
- Spinlock vs Mutex: Busy-wait vs Block
- Cache vs Buffer: Speed vs Flow
- VM vs Container: Isolation vs Efficiency

