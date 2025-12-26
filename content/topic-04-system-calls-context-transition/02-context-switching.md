# Context Switching - Deep Dive

## Quick Reference (TL;DR)

**Context Switch**: Saving state of current process/thread and restoring another. Cost: ~1-10 microseconds. Expensive due to cache/TLB flushes, register saves, memory barrier overhead.

**When it happens**: Process/thread blocks, time quantum expires, higher priority thread becomes ready, system call blocks.

**Optimization**: Modern CPUs have hardware support, but context switches are still expensive.

---

## 1. Clear Definition

A **context switch** is the process of saving the execution state (context) of the currently running process or thread and restoring the state of another process or thread so it can resume execution.

**Context** includes:
- CPU registers (general purpose, floating point, control)
- Program counter (instruction pointer)
- Stack pointer
- Memory management information (page tables)
- I/O state

💡 **Key Insight**: Context switches are expensive because they involve saving/restoring state and invalidating CPU caches/TLB.

---

## 2. Core Concepts

### What is Context

**Process Context** includes:
1. **CPU Registers**:
   - General purpose registers (RAX, RBX, RCX, etc.)
   - Floating point registers
   - Control registers (flags, status)
   - Instruction pointer (program counter)
   - Stack pointer

2. **Memory Management**:
   - Page table base address (CR3 on x86)
   - Memory mappings
   - TLB entries (may be flushed)

3. **I/O State**:
   - Open file descriptors
   - Network connections
   - Device state

4. **Process Control Block (PCB)**:
   - Process ID
   - Parent process
   - Priority
   - Scheduling information

### Context Switch Steps (Exact)

**Complete Process**:

```
1. SAVE CURRENT CONTEXT
   ├─ Save CPU registers to PCB
   ├─ Save stack pointer
   ├─ Save instruction pointer
   └─ Save floating point state

2. UPDATE SCHEDULER STATE
   ├─ Mark current process as "not running"
   ├─ Update process state (running → ready/blocked)
   └─ Add to appropriate queue

3. SELECT NEXT PROCESS
   ├─ Run scheduler algorithm
   ├─ Choose next process to run
   └─ Update process state (ready → running)

4. RESTORE NEXT CONTEXT
   ├─ Load CPU registers from PCB
   ├─ Load stack pointer
   ├─ Load instruction pointer
   ├─ Load floating point state
   └─ Load page table (CR3)

5. FLUSH CACHES (if needed)
   ├─ Flush TLB (Translation Lookaside Buffer)
   ├─ Invalidate instruction cache
   └─ Memory barriers

6. RESUME EXECUTION
   └─ Jump to saved instruction pointer
```

### Cost Breakdown

**Typical Context Switch Cost** (~1-10 microseconds):

| Component | Time | Description |
|-----------|------|-------------|
| Save registers | 100-500 ns | Write to memory |
| Update scheduler | 50-200 ns | Queue operations |
| Select next process | 100-1000 ns | Scheduler algorithm |
| Restore registers | 100-500 ns | Load from memory |
| Load page table | 200-500 ns | Update CR3 |
| TLB flush | 500-2000 ns | Invalidate TLB |
| Cache effects | 1000-5000 ns | Cache pollution |
| Memory barriers | 50-200 ns | Synchronization |

**Total**: ~1-10 microseconds (1000-10000 nanoseconds)

**Why it's expensive**:
1. **TLB flush**: Switching address spaces invalidates TLB
2. **Cache pollution**: New process pollutes CPU cache
3. **Memory access**: Saving/restoring state requires memory writes
4. **Scheduling overhead**: Choosing next process takes time

### When Context Switches Happen

**Voluntary** (process/thread yields):
- Blocking system call (read, write, wait)
- Thread explicitly yields (yield(), sleep())
- Waiting for I/O completion
- Waiting for synchronization (mutex, semaphore)

**Involuntary** (OS preempts):
- Time quantum expires (timer interrupt)
- Higher priority thread becomes ready
- Interrupt handler needs to run
- Process/thread exceeds CPU time limit

### System Call vs Interrupt vs Exception

🎯 **Interview Focus**: This distinction is critical.

**System Call**:
- **Trigger**: Software (trap instruction)
- **Purpose**: Request kernel service
- **Mode**: User → Kernel → User
- **Context switch**: May or may not (depends on blocking)

**Interrupt**:
- **Trigger**: Hardware (I/O device, timer)
- **Purpose**: Handle hardware events
- **Mode**: Any → Kernel → Any
- **Context switch**: Usually not (interrupt handler is fast)

**Exception**:
- **Trigger**: CPU (page fault, division by zero)
- **Purpose**: Handle errors/events
- **Mode**: Any → Kernel → Any
- **Context switch**: May trigger (page fault may block)

**Key Difference**: System calls are **synchronous** (program requests), interrupts are **asynchronous** (hardware signals).

### Why Syscalls Are Not Interrupts

**Similarities**:
- Both use interrupt mechanism
- Both switch to kernel mode
- Both have handlers

**Differences**:

| Aspect | System Call | Interrupt |
|--------|-------------|-----------|
| **Trigger** | Software (program) | Hardware (device) |
| **Synchronous** | Yes (program waits) | No (asynchronous) |
| **Purpose** | Request service | Handle event |
| **Frequency** | Program-controlled | Event-driven |
| **Context** | User-initiated | Hardware-initiated |

**Technical**: System calls use the interrupt mechanism (`int 0x80`), but they're conceptually different from hardware interrupts.

### Why Context Switching is Expensive Even Today

**Modern Challenges**:

1. **TLB Flush**:
   - Each process has different page tables
   - Switching invalidates TLB
   - TLB miss = expensive page table walk
   - Modern CPUs: ~100-200 cycles per TLB miss

2. **Cache Pollution**:
   - New process has different memory access pattern
   - Pollutes CPU cache (L1, L2, L3)
   - Next process has cold cache
   - Cache misses are expensive (~100-300 cycles)

3. **Memory Bandwidth**:
   - Saving/restoring registers requires memory writes
   - Modern CPUs: ~50-100 GB/s, but still overhead
   - Register file is fast, but memory is slower

4. **Scheduling Overhead**:
   - Choosing next process requires computation
   - Complex schedulers (CFS) have overhead
   - Queue operations (enqueue/dequeue)

5. **Memory Barriers**:
   - Required for correctness
   - Prevents instruction reordering
   - Adds latency (~50-200 cycles)

**Modern Optimizations**:
- Hardware context switching (some CPUs)
- Lazy TLB flushing (don't flush if not needed)
- CPU affinity (keep process on same core)
- Better cache locality

**But still expensive**: Even with optimizations, context switches cost ~1-10 microseconds.

---

## 3. Use Cases

### When Context Switches Are Necessary

1. **Multitasking**: Multiple processes share CPU
2. **I/O Operations**: Process blocks waiting for I/O
3. **Time Slicing**: Fair CPU time allocation
4. **Priority Scheduling**: Higher priority process preempts
5. **Real-time Systems**: Meet timing deadlines

### When to Minimize Context Switches

1. **High-performance code**: Reduce overhead
2. **Real-time systems**: Predictable latency
3. **Latency-sensitive**: Minimize delay
4. **CPU-bound tasks**: Avoid unnecessary switches

---

## 4. Advantages & Disadvantages

### Context Switching

**Advantages**:
✅ **Multitasking**: Multiple processes can run  
✅ **Fairness**: CPU time is shared  
✅ **Responsiveness**: System remains responsive  
✅ **I/O Overlap**: CPU works while I/O happens

**Disadvantages**:
❌ **Overhead**: ~1-10 microseconds per switch  
❌ **Cache effects**: Pollutes CPU cache  
❌ **TLB flush**: Invalidates address translation cache  
❌ **Latency**: Adds delay to operations

---

## 5. Best Practices

1. **Minimize switches**: Batch operations, avoid unnecessary blocking
2. **CPU affinity**: Keep process on same core when possible
3. **Lock-free algorithms**: Reduce need for blocking
4. **Profile**: Measure context switch frequency
5. **Optimize hot paths**: Reduce switches in critical code

---

## 6. Common Pitfalls

⚠️ **Mistake**: Thinking context switches are "free" (they're expensive)

⚠️ **Mistake**: Confusing system call with context switch

⚠️ **Mistake**: Not understanding when switches happen

⚠️ **Mistake**: Over-optimizing (premature optimization)

---

## 7. Interview Tips

**Common Questions**:
1. "What is a context switch?"
2. "Why are context switches expensive?"
3. "What's the difference between system call and context switch?"
4. "How can we reduce context switches?"

**Key Points**:
- Context = saved state (registers, stack, etc.)
- Expensive due to TLB flush, cache pollution
- System call may or may not trigger context switch
- Modern optimizations help, but still expensive

---

## 8. Related Topics

- **System Calls** (Topic 4): May trigger context switches
- **Process Management** (Topic 5): Process context switching
- **Threads** (Topic 6): Thread context switching (cheaper)
- **CPU Scheduling** (Topic 7): When context switches happen

---

## 9. Visual Aids

### Context Switch Timeline

```
Process A Running          Process B Running
    │                           │
    │  Timer interrupt          │
    ├───────────────────────────>│
    │  Save A's context         │
    │  (registers, stack, etc.) │
    │                           │
    │  Load B's context         │
    │  (registers, stack, etc.) │
    │                           │
    │                           │  Resume B
    │                           │  (from saved PC)
    │                           │
```

### Process vs Thread Context Switch

**Process Context Switch**:
- Save/restore full address space
- TLB flush required
- Cost: ~1-10 microseconds

**Thread Context Switch**:
- Save/restore registers only
- No TLB flush (same address space)
- Cost: ~100-1000 nanoseconds (10x faster)

---

## 10. Quick Reference Summary

**Context Switch**:
- Save current state, restore next state
- Cost: ~1-10 microseconds
- Expensive due to TLB flush, cache pollution

**When it happens**:
- Time quantum expires
- Process/thread blocks
- Higher priority ready
- System call blocks

**Key Insight**: Context switches enable multitasking but have significant overhead. Modern systems optimize but can't eliminate the cost.

