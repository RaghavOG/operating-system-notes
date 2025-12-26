# Memory Management - Fundamentals

## Quick Reference (TL;DR)

**Logical vs Physical Memory**: Logical = what program sees (virtual addresses). Physical = actual RAM (physical addresses). MMU translates between them.

**Address Translation**: CPU uses logical address → MMU translates → Physical address. Enables virtual memory, protection, relocation.

**Binding Times**: Compile time, Load time, Execution time. Modern OS uses execution-time binding (dynamic).

**MMU Role**: Memory Management Unit. Hardware that translates virtual to physical addresses. Handles page tables, TLB, protection.

---

## 1. Clear Definition

**Memory Management** is how the OS manages physical memory (RAM) and provides processes with logical (virtual) address spaces. It enables:
- **Virtual memory**: Programs see more memory than physically available
- **Protection**: Processes can't access each other's memory
- **Relocation**: Programs can run anywhere in physical memory

---

## 2. Core Concepts

### Logical vs Physical Memory

**Logical Memory (Virtual Address Space)**:
- What the **program sees**
- Addresses from 0 to max (e.g., 0 to 2^48 - 1 on 64-bit)
- Each process has its own logical address space
- Program doesn't know where it's actually in RAM

**Physical Memory (RAM)**:
- **Actual hardware** memory
- Limited size (e.g., 16 GB RAM)
- Managed by OS
- Programs don't directly access it

**Translation**: MMU translates logical → physical addresses

**Example**:
```
Program sees:
  Logical address: 0x400000
  (thinks it's at this address)

Reality:
  Physical address: 0x12340000
  (actually in RAM here)

MMU translates: 0x400000 → 0x12340000
```

### Address Translation

**Process**:
1. CPU generates **logical address** (virtual address)
2. MMU looks up in **page table**
3. MMU translates to **physical address**
4. Access physical memory

**Hardware Support**:
- **MMU**: Memory Management Unit (hardware)
- **Page Tables**: Stored in memory, managed by OS
- **TLB**: Translation Lookaside Buffer (cache for translations)

**Example Flow**:
```
CPU: "Read from address 0x400000"
  ↓
MMU: Look up in page table
  ↓
Page Table: 0x400000 → Physical frame 0x12340
  ↓
MMU: Translate to 0x12340000
  ↓
Memory: Read from physical address 0x12340000
```

### Binding Times

**When addresses are bound to physical memory**:

**1. Compile Time**:
- Addresses fixed at compile time
- Program must be loaded at specific address
- **Problem**: Can't relocate, conflicts

**2. Load Time**:
- Addresses bound when program loaded
- Loader assigns addresses
- **Problem**: Still fixed after loading

**3. Execution Time (Runtime)**:
- Addresses bound when accessed
- MMU translates on-the-fly
- **Modern approach**: Flexible, relocatable

**Modern OS**: Uses execution-time binding (virtual memory)

### MMU Role

**Memory Management Unit (MMU)**:
- **Hardware component** in CPU
- Translates virtual → physical addresses
- Handles **page tables** (stored in memory)
- Manages **TLB** (Translation Lookaside Buffer - cache)
- Enforces **protection** (read-only, no-execute)

**Functions**:
1. **Translation**: Virtual → Physical address
2. **Protection**: Check permissions (read, write, execute)
3. **Caching**: TLB for fast translations
4. **Faults**: Generate page faults for invalid accesses

**How it works**:
```
CPU Request (virtual address)
    ↓
MMU checks TLB (fast cache)
    ↓
If TLB hit: Use cached translation
If TLB miss: Look up page table
    ↓
Check permissions
    ↓
If valid: Return physical address
If invalid: Page fault (OS handles)
```

---

## 3. Use Cases

- Virtual memory systems
- Process isolation
- Memory protection
- Relocatable programs

---

## 4. Advantages & Disadvantages

**Virtual Memory Advantages**:
✅ Protection (process isolation)  
✅ Relocation (programs can run anywhere)  
✅ More memory than physical (paging to disk)  
✅ Simplified programming (flat address space)

**Disadvantages**:
❌ Overhead (translation, page tables)  
❌ Complexity (MMU, page tables)  
❌ Performance (TLB misses, page faults)

---

## 5. Best Practices

1. **Understand translation**: Know how virtual → physical works
2. **Consider TLB**: Cache-friendly access patterns
3. **Page size**: Understand trade-offs
4. **Protection**: Use memory protection features

---

## 6. Common Pitfalls

⚠️ **Mistake**: Confusing logical and physical addresses

⚠️ **Mistake**: Not understanding MMU role

⚠️ **Mistake**: Ignoring TLB effects

---

## 7. Interview Tips

**Common Questions**:
1. "Explain logical vs physical memory."
2. "How does address translation work?"
3. "What is the MMU?"
4. "What are binding times?"

**Key Points**:
- Logical = what program sees
- Physical = actual RAM
- MMU translates between them
- Modern OS uses execution-time binding

---

## 8. Related Topics

- **Virtual Memory** (Topic 12): Paging, page faults
- **Paging** (Topic 11): How memory is divided
- **Caching** (Topic 13): TLB, cache hierarchy

---

## 9. Visual Aids

### Address Translation

```
Logical Address Space        Physical Memory
┌──────────────┐            ┌──────────────┐
│  0x00000000  │            │  0x00000000  │
│      │       │            │      │       │
│      │       │   MMU      │      │       │
│      ▼       │  ────────>  │      ▼       │
│  0x400000    │            │ 0x12340000   │
│      │       │            │      │       │
│      │       │            │      │       │
│  0x7FFFFFFF  │            │ 0xFFFFFFFF  │
└──────────────┘            └──────────────┘
```

### MMU Translation Flow

```
CPU: Virtual Address 0x400000
    ↓
MMU: Check TLB
    ↓ (miss)
MMU: Look up Page Table
    ↓
Page Table: Frame 0x12340
    ↓
MMU: Physical Address 0x12340000
    ↓
Memory: Access
```

---

## 10. Quick Reference Summary

**Logical Memory**: What program sees (virtual addresses)

**Physical Memory**: Actual RAM (physical addresses)

**MMU**: Translates virtual → physical, handles protection

**Binding Time**: When addresses bound (modern = execution time)

**Address Translation**: Virtual address → Page table lookup → Physical address

