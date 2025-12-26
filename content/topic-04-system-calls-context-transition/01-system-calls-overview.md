# System Calls & Context Transition - Overview

## Quick Reference (TL;DR)

**System Call**: Mechanism for user programs to request kernel services. Triggered by trap instruction. Involves user→kernel→user transition with significant overhead (~100-1000 ns).

**Context Switch**: Saving state of one process/thread and restoring another. Expensive due to cache/TLB flushes, register saves (~1-10 microseconds).

**Key Distinction**: System call = user↔kernel transition. Context switch = process/thread switch.

---

## 1. Clear Definition

### System Call
A **system call** is a programmatic interface that allows a user-space application to request a service from the OS kernel. It's the only way user programs can access privileged kernel functionality.

### Context Switch
A **context switch** is the process of saving the state (context) of the currently running process/thread and restoring the state of another process/thread so it can resume execution.

💡 **Key Insight**: System calls may or may not trigger context switches. A system call that blocks (waits for I/O) will trigger a context switch, but a simple system call (like `getpid()`) may not.

---

## 2. Core Concepts

### What Triggers a System Call

**Explicit Triggers**:
- Direct system call: `syscall()` or `int 0x80`
- Library function: `open()`, `read()`, `write()`, `fork()`, `exec()`
- Language runtime: Garbage collector, memory allocator

**Implicit Triggers**:
- Page fault (accessing unmapped memory)
- Segmentation fault (invalid memory access)
- Division by zero
- Hardware interrupts (I/O completion)

### Trap Instruction

**Mechanism**:
```c
// User code
write(fd, buffer, size);

// Library implementation (simplified)
write(int fd, void *buf, size_t count) {
    // Prepare arguments in registers
    // System call number in eax/rax
    // Arguments in other registers
    
    asm volatile (
        "int $0x80"  // x86: interrupt 0x80
        // or
        "syscall"    // x86-64: fast system call
        :
        : "a" (sys_write), "b" (fd), "c" (buf), "d" (count)
    );
}
```

**What Happens**:
1. CPU switches to kernel mode
2. Saves user context (registers, stack)
3. Jumps to kernel interrupt handler
4. Kernel validates and executes
5. Returns to user mode

### User → Kernel → User Transition

**Complete Flow**:

```
┌─────────────────────────────────────┐
│  USER MODE (Ring 3)                 │
│                                     │
│  1. Application calls write()      │
│  2. Library prepares syscall       │
│  3. Executes trap (int 0x80)       │
│     └─> CPU switches to kernel     │
└─────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  KERNEL MODE (Ring 0)               │
│                                     │
│  4. Interrupt handler runs          │
│  5. Validates system call number   │
│  6. Checks arguments                │
│  7. Performs operation              │
│  8. Prepares return value           │
│  9. Executes iret (return)          │
│     └─> CPU switches to user       │
└─────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  USER MODE (Ring 3)                 │
│                                     │
│  10. Library returns to app        │
│  11. Application continues         │
└─────────────────────────────────────┘
```

### Cost of a System Call

**Breakdown** (~100-1000 nanoseconds):

| Component | Time | Description |
|-----------|------|-------------|
| Trap instruction | 10-50 ns | CPU mode switch |
| Context save | 20-50 ns | Save user registers |
| Validation | 50-200 ns | Check args, permissions |
| Cache/TLB effects | 50-200 ns | Flush, pollution |
| Actual operation | Variable | Depends on operation |
| Context restore | 20-50 ns | Restore registers |
| Return | 10-50 ns | Mode switch back |

**Examples**:
- `getpid()`: ~100-200 ns (simple, no I/O)
- `read()`: ~1000-10000 ns (file I/O)
- `fork()`: ~1000-5000 ns (create process)

### Fast System Calls (sysenter/syscall)

**Traditional** (`int 0x80`):
- General interrupt mechanism
- Slower (~200-500 ns)
- More overhead

**Fast** (`sysenter`/`syscall`):
- CPU-specific optimized instruction
- Faster (~100-300 ns)
- Less overhead
- Still expensive, but 2x faster

**Why still slow**: Even fast syscalls need:
- Mode transition
- Security checks
- Context save/restore

---

## 3. Use Cases

### Common System Calls

**Process Management**:
- `fork()`: Create new process
- `exec()`: Replace process image
- `exit()`: Terminate process
- `wait()`: Wait for child process

**File Operations**:
- `open()`: Open file
- `read()`: Read from file
- `write()`: Write to file
- `close()`: Close file

**Memory Management**:
- `mmap()`: Map memory
- `brk()`: Change heap size
- `mprotect()`: Change memory protection

**Communication**:
- `socket()`: Create socket
- `bind()`: Bind socket
- `send()`: Send data
- `recv()`: Receive data

---

## 4. Advantages & Disadvantages

### System Call Mechanism

**Advantages**:
✅ **Security**: Kernel validates all operations  
✅ **Isolation**: User code can't access hardware directly  
✅ **Abstraction**: Simple interface for complex operations  
✅ **Portability**: Same interface across hardware

**Disadvantages**:
❌ **Overhead**: 10-100x slower than function calls  
❌ **Latency**: Adds delay to operations  
❌ **Cache effects**: Can hurt performance

---

## 5. Best Practices

1. **Minimize system calls**: Batch operations
2. **Use appropriate APIs**: Some are faster
3. **Profile**: Measure before optimizing
4. **Consider alternatives**: Memory-mapped files, async I/O

---

## 6. Common Pitfalls

⚠️ **Mistake**: Confusing system calls with library calls

⚠️ **Mistake**: Not understanding the cost

⚠️ **Mistake**: Over-optimizing prematurely

⚠️ **Mistake**: Thinking all syscalls are equal (they're not)

---

## 7. Interview Tips

**Common Questions**:
1. "What triggers a system call?"
2. "Explain the system call flow."
3. "Why are system calls expensive?"
4. "What's the difference between system call and context switch?"

**Key Points**:
- Trap instruction triggers syscall
- User→Kernel→User transition
- Overhead from mode switches, validation
- System call ≠ context switch (but may trigger one)

---

## 8. Related Topics

- **User Mode vs Kernel Mode** (Topic 3): Privilege levels
- **Process Management** (Topic 5): How syscalls manage processes
- **Threads** (Topic 6): Thread-related syscalls

---

## 9. Visual Aids

### System Call Flow Diagram

```
User Space                Kernel Space
    │                         │
    │ 1. write(fd, buf, n)   │
    ├─────────────────────────>│
    │                         │ 2. Validate
    │                         │ 3. Execute
    │                         │ 4. Return
    │<─────────────────────────┤
    │ 5. Return value         │
    │                         │
```

### System Call vs Interrupt vs Exception

| Type | Trigger | Purpose | Handler |
|------|---------|---------|---------|
| **System Call** | Software (trap) | Request kernel service | System call handler |
| **Interrupt** | Hardware | I/O completion, timer | Interrupt handler |
| **Exception** | CPU | Error (page fault, div by 0) | Exception handler |

---

## 10. Quick Reference Summary

**System Call**:
- User program → Kernel service
- Triggered by trap instruction
- Cost: ~100-1000 ns
- May or may not trigger context switch

**Key Operations**:
1. Trap instruction
2. Mode switch (User → Kernel)
3. Validation
4. Execution
5. Mode switch (Kernel → User)

**Fast Syscalls**: `sysenter`/`syscall` (~2x faster than `int 0x80`)

