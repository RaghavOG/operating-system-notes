# User Mode vs Kernel Mode - Privilege Levels

## Quick Reference (TL;DR)

**User Mode (Ring 3)**: Applications run here. Limited privileges, cannot access hardware directly, cannot disable interrupts, memory protection enforced.

**Kernel Mode (Ring 0)**: OS kernel runs here. Full privileges, direct hardware access, can disable interrupts, can modify page tables.

**Transition**: User → Kernel via system calls (trap instruction). Kernel → User via return from interrupt.

---

## 1. Clear Definition

### User Mode (Ring 3)
The **unprivileged mode** where applications run. Limited access to hardware, enforced memory protection, cannot execute privileged instructions.

### Kernel Mode (Ring 0)
The **privileged mode** where the OS kernel runs. Full access to hardware, can modify system state, can execute all CPU instructions.

💡 **Key Insight**: This separation is fundamental to OS security and stability. User programs cannot crash the system or access other processes' memory.

---

## 2. Core Concepts

### CPU Privilege Levels (Rings)

**x86 Architecture** (most common):
- **Ring 0**: Kernel mode (highest privilege)
- **Ring 1-2**: Rarely used (hypervisors, device drivers)
- **Ring 3**: User mode (lowest privilege)

**ARM Architecture**:
- **EL0**: User mode (Exception Level 0)
- **EL1**: Kernel mode (Exception Level 1)
- **EL2**: Hypervisor mode
- **EL3**: Secure monitor mode

### What Kernel Mode Can Do That User Mode Can't

**Privileged Operations**:
1. **Disable interrupts**: `CLI` instruction (Clear Interrupt Flag)
2. **Modify page tables**: Change memory mappings
3. **Access I/O ports**: Direct hardware access
4. **Halt CPU**: `HLT` instruction
5. **Change privilege level**: Switch to user mode
6. **Access control registers**: CR0, CR3, etc.
7. **Modify interrupt descriptor table**: Change interrupt handlers

**Example**:
```c
// User mode - This will cause a fault
cli();  // Clear interrupts - PRIVILEGED INSTRUCTION
// Result: General Protection Fault

// Kernel mode - This is allowed
cli();  // OK - we're in kernel mode
```

### Why Kernel Mode Exists

**Security**:
- Prevents applications from accessing other processes' memory
- Prevents applications from crashing the system
- Enforces access control

**Stability**:
- Kernel code is trusted and tested
- User code bugs don't affect kernel
- Isolation between processes

**Resource Management**:
- Kernel controls hardware resources
- Prevents resource exhaustion
- Enforces fair scheduling

### How Privilege Escalation Bugs Happen

**Common Vulnerabilities**:

1. **Buffer Overflow in Kernel**:
   - Attacker overwrites kernel stack
   - Changes return address to malicious code
   - Code runs in kernel mode → full system access

2. **Use-After-Free**:
   - Kernel frees memory
   - Attacker reallocates and writes malicious data
   - Kernel uses freed memory → executes attacker code

3. **Integer Overflow**:
   - Attacker provides large input
   - Integer wraps around
   - Kernel accesses wrong memory location

4. **Race Conditions**:
   - Attacker exploits timing window
   - Kernel checks permission, then uses resource
   - Attacker changes state between check and use

**Example Attack Flow**:
```
1. Attacker finds kernel vulnerability
2. Exploits bug to execute code in kernel mode
3. Code runs with kernel privileges
4. Attacker can:
   - Modify any memory
   - Disable security features
   - Install rootkit
   - Access all processes
```

---

## 3. Use Cases

### User Mode Operations

- Application logic execution
- Standard library calls
- User-space computations
- File I/O (via system calls)
- Network operations (via system calls)

### Kernel Mode Operations

- System call handling
- Interrupt handling
- Process scheduling
- Memory management (page tables)
- Device driver operations
- Security enforcement

---

## 4. Advantages & Disadvantages

### User Mode Advantages

✅ **Security**: Cannot crash system or access other processes  
✅ **Isolation**: Processes are isolated from each other  
✅ **Stability**: Bugs in user code don't affect kernel  
✅ **Portability**: Same code works on different OS

### User Mode Disadvantages

❌ **Limited access**: Cannot access hardware directly  
❌ **Overhead**: System calls required for kernel services  
❌ **Performance**: Mode transitions are expensive

### Kernel Mode Advantages

✅ **Full control**: Direct hardware access  
✅ **Performance**: No mode transitions needed  
✅ **Efficiency**: Can optimize critical paths

### Kernel Mode Disadvantages

❌ **Responsibility**: Bugs can crash entire system  
❌ **Security risk**: Full system access  
❌ **Complexity**: Must be carefully written

---

## 5. Best Practices

1. **Minimize kernel code**: Less code = fewer bugs
2. **Validate all inputs**: Never trust user data
3. **Use least privilege**: Only use kernel mode when necessary
4. **Defense in depth**: Multiple security layers
5. **Code review**: Kernel code must be carefully reviewed

---

## 6. Common Pitfalls

⚠️ **Mistake**: Thinking user mode can access hardware (it can't, must use system calls)

⚠️ **Mistake**: Assuming kernel mode is "safe" (it's powerful but risky)

⚠️ **Mistake**: Not understanding why system calls are slow (mode transition)

⚠️ **Mistake**: Confusing user mode with "user space" (related but different concepts)

---

## 7. Interview Tips

**Common Questions**:
1. "What's the difference between user mode and kernel mode?"
2. "Why can't user programs disable interrupts?"
3. "Can kernel code crash the OS? Why?"
4. "How does privilege escalation work?"

**Key Points**:
- **Privilege levels**: Ring 0 (kernel) vs Ring 3 (user)
- **What kernel can do**: Disable interrupts, modify page tables, access hardware
- **Security**: Separation prevents user code from crashing system
- **Transitions**: System calls switch from user to kernel mode

---

## 8. Related Topics

- **System Calls** (Topic 4): How user mode calls kernel mode
- **Process Management** (Topic 5): How kernel manages user processes
- **Security & Protection** (Topic 16): How privilege levels enforce security

---

## 9. Visual Aids

### Privilege Ring Diagram

```
        ┌─────────────────┐
        │   Ring 0        │  ← Kernel Mode
        │   (Kernel)      │     Full Privileges
        ├─────────────────┤
        │   Ring 1-2      │  ← Rarely Used
        ├─────────────────┤
        │   Ring 3        │  ← User Mode
        │   (Applications)│     Limited Privileges
        └─────────────────┘
```

### Mode Transition

```
User Mode                    Kernel Mode
   │                            │
   │  System Call (trap)        │
   ├───────────────────────────>│
   │                            │  Execute privileged
   │                            │  operation
   │  Return from interrupt     │
   │<───────────────────────────┤
   │                            │
```

### Memory Protection

```
User Process A (Ring 3)
┌─────────────────┐
│  User Memory    │  ← Can only access own memory
└─────────────────┘

Kernel (Ring 0)
┌─────────────────┐
│  Kernel Memory  │  ← Can access all memory
│  + All Process  │
│    Memory       │
└─────────────────┘
```

---

## 10. Quick Reference Summary

| Aspect | User Mode (Ring 3) | Kernel Mode (Ring 0) |
|--------|-------------------|---------------------|
| **Privilege** | Low | High |
| **Hardware Access** | Via system calls | Direct |
| **Interrupts** | Cannot disable | Can disable |
| **Memory** | Own process only | All memory |
| **Crash Impact** | Own process | Entire system |
| **Code Location** | Applications | OS kernel |
| **Security** | Enforced | Trusted |

**Key Principle**: User mode is restricted for security; kernel mode has full control for functionality.

