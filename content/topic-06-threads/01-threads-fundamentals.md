# Threads - Fundamentals

## Quick Reference (TL;DR)

**Thread**: Unit of execution within a process. Shares address space with other threads in same process. Has own stack and registers. Context switch is cheaper than process (~100-1000 ns vs ~1-10 μs).

**Thread vs Process**: Threads share memory, processes don't. Thread context switch is faster (no TLB flush). Thread crash affects entire process.

---

## 1. Clear Definition

A **thread** is a unit of execution within a process. Multiple threads within the same process share the process's address space (code, data, heap) but each has its own:
- Stack (for local variables, function calls)
- CPU registers (program counter, stack pointer)
- Thread-local storage (TLS)

💡 **Key Insight**: Threads are "lightweight processes" - they share memory but have separate execution contexts.

---

## 2. Core Concepts

### Thread as Unit of Execution

**Process contains threads**:
```
Process (Address Space)
├── Code (shared)
├── Data (shared)
├── Heap (shared)
├── Thread 1 (stack, registers)
├── Thread 2 (stack, registers)
└── Thread 3 (stack, registers)
```

**Each thread**:
- Has own execution context (registers, stack)
- Can run on different CPU core
- Shares process resources (memory, files)

### Thread States

Similar to process states:

1. **NEW**: Thread being created
2. **READY**: Ready to run, waiting for CPU
3. **RUNNING**: Currently executing
4. **WAITING/BLOCKED**: Waiting for event (I/O, lock)
5. **TERMINATED**: Finished execution

**State transitions**: Same as processes

### Thread Context vs Process Context

**Thread Context** (what's saved on thread switch):
- CPU registers (general purpose, floating point)
- Stack pointer
- Program counter
- Thread-local storage pointer
- Signal mask

**Process Context** (what's shared):
- Address space (code, data, heap)
- Open file descriptors
- Process ID
- Page tables
- Signal handlers

**Key Difference**: Thread context is smaller (just registers), process context includes memory management.

### TLS (Thread Local Storage)

**Definition**: Storage that is unique to each thread. Each thread has its own copy of TLS variables.

**Use cases**:
- Per-thread error codes
- Per-thread counters
- Per-thread caches
- Avoiding shared state

**Example**:
```c
__thread int counter;  // Each thread has own copy

void thread_function() {
    counter++;  // Modifies only this thread's copy
}
```

**Implementation**: Compiler/runtime allocates separate storage for each thread.

### Why Threads Are Faster Than Processes

**Context Switch Cost**:

**Process Context Switch**:
- Save/restore registers: ~100-500 ns
- Update page tables: ~200-500 ns
- **TLB flush**: ~500-2000 ns (expensive!)
- Cache effects: ~1000-5000 ns
- **Total**: ~1-10 microseconds

**Thread Context Switch**:
- Save/restore registers: ~100-500 ns
- No page table update (same address space)
- **No TLB flush** (same address space)
- Cache effects: ~500-2000 ns
- **Total**: ~100-1000 nanoseconds (10x faster!)

**Key Difference**: No TLB flush for threads (same address space).

### Why Thread Context Switch is Cheaper

**Reasons**:

1. **Same Address Space**: No page table switch, no TLB flush
2. **Shared Memory**: Cache is more likely to be warm
3. **Less State**: Only registers, not full process state
4. **Faster Scheduling**: Threads in same process

**Cost Comparison**:
- Process switch: ~1-10 μs
- Thread switch: ~100-1000 ns (10x faster)

### Can Threads Run on Different Cores?

**Answer**: **Yes**, threads can run on different CPU cores simultaneously.

**Parallelism**:
- **Process-level**: Multiple processes on multiple cores
- **Thread-level**: Multiple threads on multiple cores

**Example**:
```
CPU Core 1: Thread 1 of Process A
CPU Core 2: Thread 2 of Process A
CPU Core 3: Thread 1 of Process B
CPU Core 4: Thread 2 of Process B
```

**Requirements**:
- Multi-core CPU
- OS scheduler assigns threads to cores
- Threads must be ready to run

**Benefits**:
- True parallelism
- Better CPU utilization
- Faster execution

### What Breaks When One Thread Crashes?

🎯 **Interview Focus**: This tests understanding of thread isolation.

**Answer**: **The entire process crashes** (all threads die).

**Why**:
- Threads share address space
- No memory protection between threads
- Thread crash can corrupt shared memory
- OS can't isolate threads (they're in same process)

**Example**:
```c
// Thread 1 crashes (segmentation fault)
// Result: Entire process terminates
// All threads (Thread 2, Thread 3) also die
```

**Contrast with processes**:
- Process crash → only that process dies
- Other processes unaffected
- Memory isolation protects other processes

**Implication**: Threads provide less fault tolerance than processes.

---

## 3. Use Cases

### When to Use Threads

1. **Parallel computation**: CPU-bound tasks on multiple cores
2. **I/O concurrency**: Overlap I/O with computation
3. **Responsive UI**: Background threads for UI responsiveness
4. **Server handling**: One thread per client connection

### When to Use Processes

1. **Fault isolation**: One crash shouldn't affect others
2. **Security**: Isolated address spaces
3. **Different programs**: Running different executables

---

## 4. Advantages & Disadvantages

### Threads

**Advantages**:
✅ **Fast context switch**: ~10x faster than processes  
✅ **Shared memory**: Easy communication  
✅ **Efficient**: Less overhead  
✅ **Parallelism**: Can use multiple cores

**Disadvantages**:
❌ **No isolation**: One crash kills all  
❌ **Synchronization needed**: Shared memory requires locks  
❌ **Complexity**: Race conditions, deadlocks  
❌ **Less secure**: No memory protection

### Processes

**Advantages**:
✅ **Isolation**: One crash doesn't affect others  
✅ **Security**: Memory protection  
✅ **Fault tolerance**: Better reliability

**Disadvantages**:
❌ **Slower context switch**: ~10x slower  
❌ **IPC needed**: Communication is complex  
❌ **More overhead**: Separate address spaces

---

## 5. Best Practices

1. **Use threads for parallelism**: When you need speed
2. **Use processes for isolation**: When you need safety
3. **Synchronize shared data**: Use locks, mutexes
4. **Minimize shared state**: Reduce synchronization needs

---

## 6. Common Pitfalls

⚠️ **Mistake**: Thinking threads are isolated (they're not)

⚠️ **Mistake**: Not synchronizing shared memory

⚠️ **Mistake**: Assuming thread crash only affects that thread

⚠️ **Mistake**: Overusing threads (overhead, complexity)

---

## 7. Interview Tips

**Common Questions**:
1. "What's the difference between thread and process?"
2. "Why are threads faster?"
3. "Can threads run on different cores?"
4. "What happens when a thread crashes?"

**Key Points**:
- Threads share memory, processes don't
- Thread context switch is faster (no TLB flush)
- Threads can run on different cores
- Thread crash kills entire process

---

## 8. Related Topics

- **Process Management** (Topic 5): Process vs thread
- **CPU Scheduling** (Topic 7): Thread scheduling
- **Concurrency** (Topic 8): Thread synchronization
- **Synchronization** (Topic 9): Thread coordination

---

## 9. Visual Aids

### Process vs Thread Memory

**Processes** (separate address spaces):
```
Process A              Process B
┌──────────┐          ┌──────────┐
│ Memory   │          │ Memory   │
│ (isolated)│          │ (isolated)│
└──────────┘          └──────────┘
```

**Threads** (shared address space):
```
Process
┌─────────────────────┐
│  Shared Memory      │
│  (Code, Data, Heap) │
├─────────────────────┤
│ Thread 1 Stack      │
│ Thread 2 Stack      │
│ Thread 3 Stack      │
└─────────────────────┘
```

### Context Switch Cost

```
Time (nanoseconds)
  │
  │
10000│  ● Process Context Switch
  │     (TLB flush, page tables)
  │
  │
1000 │  ● Thread Context Switch
  │     (no TLB flush)
  │
  │
 100│
  │
  10│
  │
   1│
  └─────────────────────────→
```

---

## 10. Quick Reference Summary

**Thread**: Unit of execution, shares address space, has own stack/registers

**Context Switch**: ~100-1000 ns (vs ~1-10 μs for process)

**Key Advantage**: Faster (no TLB flush), shared memory

**Key Disadvantage**: No isolation (crash kills all threads)

