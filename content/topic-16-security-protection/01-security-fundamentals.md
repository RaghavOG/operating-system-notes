# Security & Protection - Fundamentals

## Quick Reference (TL;DR)

**Protection**: Internal mechanism (prevent processes from accessing each other). **Security**: External threats (prevent attacks from outside).

**Access Control**: Who can access what. **Access Control Matrix**: Rows=subjects, Columns=objects, Entries=permissions.

**Capabilities vs ACLs**: Capabilities = what subject can do (held by subject). ACLs = who can access object (attached to object).

**Privilege Escalation**: Gaining higher privileges than intended. Kernel bugs can enable this (kernel has full system access).

---

## 1. Clear Definition

**Protection** is the internal mechanism to prevent processes from interfering with each other. **Security** is protection against external threats (attacks, malware).

**Relationship**: Protection is a subset of security (internal security).

---

## 2. Core Concepts

### Protection vs Security

**Protection**:
- **Internal**: Prevent processes from accessing each other
- **Mechanism**: Memory protection, privilege levels
- **Goal**: Correctness, isolation

**Security**:
- **External**: Prevent attacks, malware
- **Mechanism**: Authentication, encryption, firewalls
- **Goal**: Prevent unauthorized access

**Example**:
- **Protection**: Process A can't access Process B's memory
- **Security**: Prevent attacker from running malicious code

### Access Control Matrix

**Structure**:
- **Rows**: Subjects (processes, users)
- **Columns**: Objects (files, memory, devices)
- **Entries**: Permissions (read, write, execute)

**Example**:
```
        File1  File2  Memory  Device
User1   rw     r      -       -
User2   r      rw     -       r
Process1 rw     -      rw      -
```

**Implementation**:
- **ACLs (Access Control Lists)**: Per-object (columns)
- **Capabilities**: Per-subject (rows)

### Capabilities vs ACLs

**ACLs (Access Control Lists)**:
- **Attached to object**: File has list of who can access
- **Check**: When access requested, check object's ACL
- **Example**: File permissions (Linux)

**Capabilities**:
- **Held by subject**: Process has tokens for what it can access
- **Check**: Process presents capability
- **Example**: File descriptors (Linux), some security systems

**Comparison**:
| Aspect | ACLs | Capabilities |
|--------|------|--------------|
| **Location** | Object | Subject |
| **Check** | At object | At subject |
| **Revocation** | Easy (modify object) | Hard (find all copies) |
| **Delegation** | Hard | Easy (pass capability) |

**Modern**: Most systems use ACLs (simpler, easier revocation).

### Privilege Escalation

**Definition**: Gaining higher privileges than intended.

**Types**:
1. **Vertical**: Lower privilege → Higher privilege (user → root)
2. **Horizontal**: Same privilege, different account

**Methods**:
- **Exploit bugs**: Buffer overflow, use-after-free
- **Social engineering**: Trick user into running malicious code
- **Configuration errors**: Misconfigured permissions

**Kernel bugs**: Especially dangerous (kernel has full system access).

### Why Kernel Bugs Are Fatal

**Kernel Privileges**:
- Runs in kernel mode (Ring 0)
- Can access all memory
- Can modify page tables
- Can disable interrupts
- Can bypass all security

**Impact**:
- **Full system compromise**: Attacker gets root access
- **Persistence**: Can install rootkits
- **Undetectable**: Can hide from security tools

**Example Attack**:
```
1. Attacker finds kernel buffer overflow
2. Exploits to execute code in kernel mode
3. Code runs with kernel privileges
4. Attacker can:
   - Modify any memory
   - Install backdoors
   - Access all processes
   - Bypass all security
```

**Why fatal**: No higher authority than kernel (it is the security boundary).

### Why Sandboxing Works

**Sandboxing**: Isolate untrusted code in restricted environment.

**Mechanisms**:
- **Process isolation**: Separate address space
- **System call filtering**: Block dangerous syscalls
- **Resource limits**: CPU, memory, I/O limits
- **Capability restrictions**: Limited file access

**Why it works**:
- Even if code is malicious, it's isolated
- Can't access other processes
- Can't access system resources
- OS enforces boundaries

**Example**: 
- Browser sandbox (each tab isolated)
- Container isolation
- Virtual machines

### Why Containers Are Not VMs

**Containers**:
- **Share kernel**: All containers use host OS kernel
- **Lightweight**: Less overhead
- **Fast startup**: Seconds
- **Less isolation**: Kernel bugs affect all

**Virtual Machines**:
- **Separate kernel**: Each VM has own OS
- **Heavyweight**: More overhead
- **Slower startup**: Minutes
- **Strong isolation**: Kernel bugs isolated per VM

**Key Difference**: Containers share kernel, VMs don't.

**Security Implication**: Container escape = host kernel compromise. VM escape = hypervisor compromise (harder).

---

## 3. Use Cases

- Multi-user systems
- Server security
- Application sandboxing
- Cloud computing

---

## 4. Advantages & Disadvantages

**Protection Advantages**:
✅ Process isolation  
✅ Fault tolerance  
✅ Security foundation

**Disadvantages**:
❌ Overhead (address translation, checks)  
❌ Complexity

**Security Advantages**:
✅ Prevents attacks  
✅ Protects data  
✅ Maintains integrity

**Disadvantages**:
❌ Complex (many attack vectors)  
❌ Performance cost  
❌ Can never be perfect

---

## 5. Best Practices

1. **Principle of least privilege**: Give minimum necessary permissions
2. **Defense in depth**: Multiple security layers
3. **Keep systems updated**: Patch vulnerabilities
4. **Monitor**: Detect attacks

---

## 6. Common Pitfalls

⚠️ **Mistake**: Confusing protection and security

⚠️ **Mistake**: Thinking containers provide VM-level isolation

⚠️ **Mistake**: Not understanding kernel privilege implications

---

## 7. Interview Tips

**Common Questions**:
1. "Compare protection vs security."
2. "Explain ACLs vs capabilities."
3. "Why are kernel bugs fatal?"
4. "Why are containers not VMs?"

**Key Points**:
- Protection = internal, Security = external
- ACLs = per-object, Capabilities = per-subject
- Kernel = highest privilege, bugs are fatal
- Containers share kernel, VMs don't

---

## 8. Related Topics

- **User Mode vs Kernel Mode** (Topic 3): Privilege levels
- **Virtualization** (Topic 17): Containers vs VMs

---

## 9. Visual Aids

### Access Control Matrix

```
        File1  File2  Memory
User1   rw     r      -
User2   r      rw     -
Process rw     -      rw
```

### Container vs VM Isolation

```
Containers (shared kernel):
┌──────────┐  ┌──────────┐
│Container1│  │Container2│
└────┬─────┘  └────┬─────┘
     └──────┬──────┘
           │
     ┌─────▼─────┐
     │Host Kernel│
     └───────────┘

VMs (separate kernels):
┌──────────┐  ┌──────────┐
│   VM 1   │  │   VM 2   │
│  Kernel  │  │  Kernel  │
└────┬─────┘  └────┬─────┘
     └──────┬──────┘
           │
     ┌─────▼─────┐
     │Hypervisor│
     └───────────┘
```

---

## 10. Quick Reference Summary

**Protection**: Internal isolation (processes)

**Security**: External threats (attacks)

**ACLs**: Per-object access control

**Capabilities**: Per-subject access control

**Kernel bugs**: Fatal (full system access)

**Containers**: Share kernel (less isolation than VMs)

