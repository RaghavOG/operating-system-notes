# Concurrency Fundamentals

## Quick Reference (TL;DR)

**Concurrency**: Multiple threads/processes executing simultaneously or interleaved. Requires synchronization to avoid race conditions.

**Critical Section**: Code that accesses shared resources. Must be protected (mutex, locks).

**Atomicity**: Operation completes entirely or not at all. No partial execution visible.

**Visibility**: Changes by one thread visible to others. Requires memory barriers/cache coherence.

**Ordering**: Operations happen in expected order. Compilers/CPUs can reorder for performance.

---

## 1. Clear Definition

**Concurrency** is the execution of multiple threads or processes that may access shared resources. Without proper synchronization, this leads to **race conditions** and incorrect behavior.

**Key Concepts**:
- **Critical Section**: Code accessing shared resources
- **Atomicity**: All-or-nothing execution
- **Visibility**: Memory consistency
- **Ordering**: Execution order guarantees

---

## 2. Core Concepts

### Critical Section

**Definition**: A section of code that accesses shared resources (variables, data structures, files) that must not be accessed by multiple threads simultaneously.

**Properties** (must ensure):
1. **Mutual Exclusion**: Only one thread in critical section at a time
2. **Progress**: If no thread in critical section, a waiting thread can enter
3. **Bounded Waiting**: No thread waits forever

**Example**:
```c
int counter = 0;  // Shared variable

void increment() {
    // Critical section starts
    counter++;  // Not atomic! Race condition possible
    // Critical section ends
}
```

**Solution**: Use mutex/lock
```c
pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;

void increment() {
    pthread_mutex_lock(&lock);  // Enter critical section
    counter++;
    pthread_mutex_unlock(&lock);  // Exit critical section
}
```

### Atomicity

**Definition**: An operation is **atomic** if it completes entirely or not at all. No other thread can see a partial execution.

**Non-atomic Example**:
```c
counter++;  // Not atomic!
// Actually: read → increment → write (3 steps)
// Another thread can interrupt between steps
```

**Atomic Operations**:
- Hardware: Compare-and-swap (CAS), test-and-set
- Language: Atomic variables, atomic operations
- OS: System calls (usually atomic)

**Example**:
```c
// Atomic increment (hardware instruction)
__atomic_add_fetch(&counter, 1, __ATOMIC_SEQ_CST);
```

### Visibility

**Definition**: Changes made by one thread are **visible** to other threads. Requires proper memory synchronization.

**Problem**: CPU caches can hide writes
```
Thread 1 (CPU 1)        Thread 2 (CPU 2)
counter = 42;           while (counter == 0);
(writes to cache)       (reads from cache)
                        (may not see write!)
```

**Solution**: Memory barriers, cache coherence protocols
```c
// Memory barrier ensures visibility
__atomic_store(&counter, 42, __ATOMIC_RELEASE);
// Other threads will see this write
```

### Ordering

**Definition**: Operations happen in the **expected order**. Compilers and CPUs can reorder instructions for performance.

**Problem**: Reordering can break assumptions
```c
// Thread 1
flag = true;
data = 42;

// Thread 2
while (!flag);
assert(data == 42);  // May fail! Reordering possible
```

**Solution**: Memory barriers, acquire/release semantics
```c
// Thread 1
data = 42;
__atomic_store(&flag, true, __ATOMIC_RELEASE);  // Ensures ordering

// Thread 2
while (!__atomic_load(&flag, __ATOMIC_ACQUIRE));
assert(data == 42);  // Now guaranteed
```

### Race Conditions

**Read-Modify-Write Hazards**:
```c
// Not atomic!
counter = counter + 1;  // Read → Modify → Write
// Another thread can modify between read and write
```

**Lost Updates**:
```
Thread 1: read counter (value=5)
Thread 2: read counter (value=5)
Thread 1: write counter (value=6)
Thread 2: write counter (value=6)  // Lost update! Should be 7
```

**Memory Reordering Issues**:
```c
// Thread 1
x = 1;
y = 2;  // CPU may reorder these!

// Thread 2
if (y == 2) {
    assert(x == 1);  // May fail due to reordering
}
```

---

## 3. Use Cases

- Multi-threaded applications
- Shared data structures
- Producer-consumer patterns
- Reader-writer scenarios

---

## 4. Advantages & Disadvantages

**Concurrency Advantages**:
✅ Parallelism (multiple cores)  
✅ Responsiveness (I/O overlap)  
✅ Throughput (more work done)

**Concurrency Disadvantages**:
❌ Complexity (synchronization needed)  
❌ Bugs (race conditions, deadlocks)  
❌ Overhead (locks, barriers)

---

## 5. Best Practices

1. **Minimize shared state**: Less to synchronize
2. **Use atomic operations**: When possible
3. **Acquire/release semantics**: For ordering
4. **Test thoroughly**: Race conditions are hard to find

---

## 6. Common Pitfalls

⚠️ **Mistake**: Thinking single operations are atomic (they're not)

⚠️ **Mistake**: Ignoring visibility (cache effects)

⚠️ **Mistake**: Assuming ordering (compiler/CPU reordering)

⚠️ **Mistake**: Not understanding why volatile is not a lock

---

## 7. Interview Tips

**Common Questions**:
1. "What is a race condition?"
2. "Explain atomicity, visibility, ordering."
3. "Why is volatile not a lock?"
4. "Why are race conditions nondeterministic?"

**Key Points**:
- Critical section needs protection
- Atomicity ≠ thread-safe
- Visibility requires synchronization
- Ordering is not guaranteed

---

## 8. Related Topics

- **Synchronization Primitives** (Topic 9): How to protect critical sections
- **Deadlocks** (Topic 10): Synchronization problems

---

## 9. Visual Aids

### Race Condition Example

```
Time →    Thread 1          Thread 2
          ────────          ────────
t1        read counter (5)
t2                          read counter (5)
t3        counter = 5 + 1
t4        write counter (6)
t5                          counter = 5 + 1
t6                          write counter (6)  ← Lost update!
```

### Memory Visibility

```
CPU 1 Cache        Main Memory        CPU 2 Cache
counter=42         counter=0          counter=0
(written)          (not yet)          (stale)
```

---

## 10. Quick Reference Summary

**Critical Section**: Shared resource access, needs protection

**Atomicity**: All-or-nothing execution

**Visibility**: Changes visible to all threads

**Ordering**: Operations in expected order

**Race Conditions**: When synchronization is missing

