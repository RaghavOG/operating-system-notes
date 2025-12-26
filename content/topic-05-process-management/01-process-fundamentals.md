# Process Management - Fundamentals

## Quick Reference (TL;DR)

**Process**: A program in execution. Consists of **address space** (memory) + **execution state** (registers, stack). Each process is isolated from others.

**Process Lifecycle**: New → Ready → Running → Waiting → Terminated. Transitions controlled by OS scheduler.

**PCB (Process Control Block)**: Kernel data structure storing all process information (PID, state, registers, memory info, etc.).

---

## 1. Clear Definition

A **process** is an instance of a program in execution. It consists of:

1. **Address Space**: The memory allocated to the process (code, data, stack, heap)
2. **Execution State**: CPU registers, program counter, stack pointer, and other runtime information

💡 **Key Insight**: A process is more than just code—it's code + data + execution context. Multiple processes can run the same program (different instances).

---

## 2. Core Concepts

### Process Definition (Address Space + Execution State)

**Address Space**:
```
┌─────────────────────────┐
│   Stack (grows down)    │  ← Local variables, function calls
├─────────────────────────┤
│         (free)          │
├─────────────────────────┤
│   Heap (grows up)       │  ← Dynamic memory (malloc)
├─────────────────────────┤
│   Data (BSS, init)      │  ← Global variables
├─────────────────────────┤
│   Code (Text)            │  ← Program instructions
└─────────────────────────┘
```

**Execution State**:
- **CPU Registers**: General purpose, floating point, control
- **Program Counter**: Current instruction
- **Stack Pointer**: Top of stack
- **Status Flags**: CPU condition codes
- **I/O State**: Open files, network connections

**Together**: Address space defines "what" (memory), execution state defines "where" (current execution point).

### Process Lifecycle (Realistic, Not Textbook)

**States**:

1. **NEW**: Process is being created
   - Allocate PCB
   - Allocate address space
   - Load program into memory
   - Initialize data structures

2. **READY**: Process is ready to run, waiting for CPU
   - In ready queue
   - All resources allocated except CPU
   - Waiting for scheduler

3. **RUNNING**: Process is executing on CPU
   - Currently using CPU
   - Only one process per CPU core
   - Can transition to:
     - **READY**: Time quantum expires, preempted
     - **WAITING**: Blocks (I/O, synchronization)

4. **WAITING/BLOCKED**: Process is waiting for event
   - I/O operation
   - Synchronization (mutex, semaphore)
   - Child process termination
   - Can only transition to **READY** when event occurs

5. **TERMINATED**: Process has finished
   - Resources being deallocated
   - PCB may remain (zombie) until parent reads exit status
   - Eventually removed from system

**State Transitions**:
```
    NEW
     │
     ▼
  READY ◄──────┐
     │         │
     │ (scheduled) │ (preempted/timeout)
     ▼         │
  RUNNING ─────┘
     │
     │ (blocks)
     ▼
  WAITING
     │
     │ (event occurs)
     ▼
  READY
     │
     │ (exits)
     ▼
 TERMINATED
```

### PCB Contents (Exact)

**Process Control Block (PCB)** - Complete structure:

**Identification**:
- Process ID (PID)
- Parent Process ID (PPID)
- User ID (UID)
- Group ID (GID)

**State Information**:
- Process state (NEW, READY, RUNNING, WAITING, TERMINATED)
- Priority
- Scheduling information

**CPU State** (saved on context switch):
- Program counter (instruction pointer)
- CPU registers (general purpose, floating point)
- Stack pointer
- Status flags

**Memory Management**:
- Page table base address (CR3 on x86)
- Memory limits
- Memory segments (code, data, stack, heap)
- Open files memory mappings

**I/O Information**:
- List of open file descriptors
- I/O devices in use
- Pending I/O operations

**Accounting**:
- CPU time used
- Memory usage
- I/O statistics
- Start time

**Scheduling**:
- Priority
- Time quantum remaining
- Last run time
- Scheduling queue pointer

**Example Size**: ~1-4 KB per process (depends on OS)

### Context Switch (Exact Steps)

**When**: Process A running → Process B running

**Steps**:

1. **Save Process A's Context**:
   ```
   - Save CPU registers to A's PCB
   - Save stack pointer
   - Save program counter
   - Save floating point registers
   - Update A's state to READY (or WAITING)
   ```

2. **Update Scheduler**:
   ```
   - Remove A from running queue
   - Add A to appropriate queue (ready/blocked)
   - Update A's PCB state
   ```

3. **Select Next Process**:
   ```
   - Run scheduler algorithm
   - Choose process B from ready queue
   - Update B's state to RUNNING
   ```

4. **Restore Process B's Context**:
   ```
   - Load CPU registers from B's PCB
   - Load stack pointer
   - Load program counter
   - Load floating point registers
   - Load page table (CR3) - switch address space
   ```

5. **Flush Caches**:
   ```
   - Flush TLB (Translation Lookaside Buffer)
   - Invalidate instruction cache (if needed)
   - Memory barriers
   ```

6. **Resume Execution**:
   ```
   - Jump to saved program counter
   - Process B resumes from where it left off
   ```

**Cost**: ~1-10 microseconds

### CPU Burst vs I/O Burst

**CPU Burst**: Period when process is using CPU
- Computation
- Data processing
- Algorithm execution

**I/O Burst**: Period when process is waiting for I/O
- Reading from disk
- Writing to network
- Waiting for user input
- Waiting for synchronization

**Process Behavior**:
```
CPU Burst → I/O Burst → CPU Burst → I/O Burst → ...
```

**Types of Processes**:
- **CPU-bound**: Long CPU bursts, short I/O bursts (scientific computing)
- **I/O-bound**: Short CPU bursts, long I/O bursts (web server, database)

**Scheduling Implications**:
- CPU-bound processes: Preemptive scheduling important
- I/O-bound processes: Responsiveness important
- Mixed: Balance both

---

## 3. Use Cases

### Real-World Scenarios

1. **Web Browser**: Each tab is a process (or thread)
2. **Operating System**: Multiple processes (file manager, network, etc.)
3. **Server**: Each client connection may be a process
4. **Development**: Compiler, linker, debugger are separate processes

---

## 4. Advantages & Disadvantages

### Process Model

**Advantages**:
✅ **Isolation**: Processes can't access each other's memory  
✅ **Security**: OS enforces boundaries  
✅ **Fault Tolerance**: One process crash doesn't affect others  
✅ **Parallelism**: Multiple processes on multiple CPUs

**Disadvantages**:
❌ **Overhead**: Creating/switching processes is expensive  
❌ **Communication**: IPC (Inter-Process Communication) is complex  
❌ **Resource Usage**: Each process has own address space

---

## 5. Best Practices

1. **Use processes for isolation**: When security/fault tolerance needed
2. **Minimize process creation**: Expensive operation
3. **Use threads for parallelism**: Within same process
4. **Understand process lifecycle**: Know when processes block

---

## 6. Common Pitfalls

⚠️ **Mistake**: Confusing process with program (process = running program)

⚠️ **Mistake**: Thinking processes share memory (they don't, unless explicitly shared)

⚠️ **Mistake**: Not understanding process states

⚠️ **Mistake**: Creating too many processes (overhead)

---

## 7. Interview Tips

**Common Questions**:
1. "What is a process?"
2. "Explain process states and transitions."
3. "What's in a PCB?"
4. "What happens during a context switch?"

**Key Points**:
- Process = Address space + Execution state
- Five states: NEW, READY, RUNNING, WAITING, TERMINATED
- PCB stores all process information
- Context switch saves/restores state

---

## 8. Related Topics

- **Threads** (Topic 6): Lightweight processes
- **CPU Scheduling** (Topic 7): When processes run
- **Memory Management** (Topic 11): Process address space
- **System Calls** (Topic 4): How processes interact with OS

---

## 9. Visual Aids

### Process Address Space

```
High Address
    │
    ▼
┌──────────────┐
│    Stack     │  ← Local variables, grows down
│      │       │
│      ▼       │
│   (free)     │
│      ▲       │
│      │       │
│    Heap      │  ← Dynamic memory, grows up
├──────────────┤
│    Data      │  ← Global variables
├──────────────┤
│    Code      │  ← Program instructions
└──────────────┘
Low Address
```

### Process State Diagram

```
         ┌─────┐
         │ NEW │
         └──┬──┘
            │
            │ (admitted)
            ▼
      ┌──────────┐
      │  READY   │◄────────┐
      └────┬─────┘         │
           │               │
           │ (scheduled)   │ (preempted)
           ▼               │
      ┌──────────┐        │
      │ RUNNING  │────────┘
      └────┬─────┘
           │
           │ (blocks)
           ▼
      ┌──────────┐
      │ WAITING  │
      └────┬─────┘
           │
           │ (event)
           ▼
      ┌──────────┐
      │TERMINATED│
      └──────────┘
```

---

## 10. Quick Reference Summary

**Process**: Program in execution = Address space + Execution state

**States**: NEW → READY → RUNNING → WAITING → TERMINATED

**PCB**: Contains all process information (PID, state, registers, memory, I/O)

**Context Switch**: Save current, restore next (~1-10 μs)

**CPU vs I/O Burst**: Process alternates between computation and I/O

