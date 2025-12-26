# Paging and Segmentation

## Quick Reference (TL;DR)

**Paging**: Divide memory into fixed-size pages. Logical address = page number + offset. Physical address = frame number + offset. Solves external fragmentation.

**Segmentation**: Divide memory into variable-size segments (code, data, stack). Logical address = segment number + offset. Solves internal fragmentation, matches program structure.

**Paging vs Segmentation**: Paging = fixed size, simple. Segmentation = variable size, matches program. Modern OS uses paging (with segmentation for protection).

---

## 1. Clear Definition

### Paging
**Paging** divides memory into fixed-size blocks called **pages** (logical) and **frames** (physical). Pages can be placed in any available frame. Solves external fragmentation.

### Segmentation
**Segmentation** divides memory into variable-size **segments** that correspond to logical program units (code, data, stack). Each segment has its own base address and limit.

---

## 2. Core Concepts

### Paging

**Pages and Frames**:
- **Page**: Fixed-size block in logical memory (typically 4 KB)
- **Frame**: Fixed-size block in physical memory (same size as page)
- **Page Table**: Maps page numbers to frame numbers

**Address Structure**:
```
Logical Address:
  [Page Number] [Offset]
  (e.g., 20 bits) (12 bits for 4KB pages)

Physical Address:
  [Frame Number] [Offset]
  (from page table) (same as logical offset)
```

**Translation**:
```
Logical Address: 0x400000
  Page Number: 0x400 (page 1024)
  Offset: 0x000

Page Table Lookup:
  Page 1024 → Frame 0x12340

Physical Address: 0x12340000
  Frame Number: 0x12340
  Offset: 0x000
```

**Advantages**:
✅ No external fragmentation  
✅ Simple allocation (any free frame)  
✅ Easy to implement

**Disadvantages**:
❌ Internal fragmentation (page not fully used)  
❌ Page table overhead  
❌ No logical structure (pages are arbitrary)

### Segmentation

**Segments**:
- **Code segment**: Program instructions
- **Data segment**: Global variables
- **Stack segment**: Local variables, function calls
- **Heap segment**: Dynamic memory

**Address Structure**:
```
Logical Address:
  [Segment Number] [Offset]
  (which segment) (offset within segment)
```

**Segment Table**:
- Maps segment number to base address and limit
- Base: Where segment starts in physical memory
- Limit: Maximum offset (size of segment)

**Translation**:
```
Logical Address: [Segment 2, Offset 0x100]
  Segment Table Lookup:
    Segment 2 → Base=0x50000, Limit=0x10000
  Check: Offset 0x100 < Limit 0x10000 ✓
  Physical Address: Base + Offset = 0x50000 + 0x100 = 0x50100
```

**Advantages**:
✅ Matches program structure  
✅ No internal fragmentation (variable size)  
✅ Protection per segment (code read-only, etc.)

**Disadvantages**:
❌ External fragmentation (variable sizes)  
❌ Complex allocation  
❌ Compaction needed

### Paging vs Segmentation

| Aspect | Paging | Segmentation |
|--------|--------|--------------|
| **Size** | Fixed | Variable |
| **Structure** | Arbitrary | Logical (code, data, stack) |
| **Fragmentation** | Internal | External |
| **Allocation** | Simple | Complex |
| **Protection** | Per page | Per segment |
| **Translation** | Page table | Segment table |

**Modern Approach**: **Paged segmentation**
- Use segmentation for protection (code, data segments)
- Use paging for memory management (divide segments into pages)
- Best of both worlds

**Example**: x86-64 uses segmentation for protection, paging for memory management.

### Multi-level Page Tables

**Problem**: Large address spaces need huge page tables
- 64-bit: 2^64 addresses
- 4KB pages: 2^52 pages
- Each page table entry: 8 bytes
- Total: 2^52 × 8 = 32 petabytes (too large!)

**Solution**: **Multi-level page tables**
- Divide page table into multiple levels
- Only allocate pages for used address space
- Sparse representation

**Example (2-level)**:
```
Logical Address: [Level 1] [Level 2] [Offset]
  Level 1: Points to page table
  Level 2: Points to frame
  Offset: Within page
```

**Benefits**:
✅ Sparse (only allocate used pages)  
✅ Smaller memory footprint  
✅ Still O(1) lookup (with TLB)

**Trade-off**: More memory accesses (2-4 levels), but TLB caches results.

### Inverted Page Tables

**Problem**: One page table per process (many processes = many tables)

**Solution**: **Inverted page table**
- One table for entire system
- Entry per physical frame (not per page)
- Maps frame → (process, page)

**Structure**:
```
Inverted Page Table:
  Frame 0 → (Process A, Page 5)
  Frame 1 → (Process B, Page 2)
  Frame 2 → (Process A, Page 10)
  ...
```

**Lookup**: Search table for (process, page) → find frame

**Advantages**:
✅ One table for all processes  
✅ Smaller memory footprint

**Disadvantages**:
❌ Slow lookup (must search)  
❌ Hash table needed for efficiency

**Use**: Some systems (PowerPC, some embedded)

---

## 3. Use Cases

### Paging
- Modern general-purpose OS (Linux, Windows)
- Virtual memory systems
- When simplicity needed

### Segmentation
- Older systems (early x86)
- Systems needing logical structure
- Combined with paging (paged segmentation)

---

## 4. Advantages & Disadvantages

See comparison table above.

---

## 5. Best Practices

1. **Understand both**: Know when each is used
2. **Modern systems**: Usually paging (with segmentation for protection)
3. **Page size**: Understand trade-offs (4KB common)

---

## 6. Common Pitfalls

⚠️ **Mistake**: Confusing pages and segments

⚠️ **Mistake**: Not understanding modern hybrid approach

---

## 7. Interview Tips

**Common Questions**:
1. "Compare paging vs segmentation."
2. "How does paging work?"
3. "What are multi-level page tables?"

**Key Points**:
- Paging = fixed size, simple
- Segmentation = variable size, logical
- Modern = paged segmentation

---

## 8. Related Topics

- **Memory Management** (Topic 11): Fundamentals
- **Virtual Memory** (Topic 12): Paging with disk

---

## 9. Visual Aids

### Paging

```
Logical Memory        Physical Memory
┌──────────┐         ┌──────────┐
│ Page 0   │────────>│ Frame 2  │
│ Page 1   │────────>│ Frame 5  │
│ Page 2   │────────>│ Frame 0  │
│ Page 3   │────────>│ Frame 7  │
└──────────┘         └──────────┘
```

### Segmentation

```
Logical Memory        Physical Memory
┌──────────┐         ┌──────────┐
│ Code     │────────>│ 0x10000  │
│          │         │          │
│ Data     │────────>│ 0x50000  │
│          │         │          │
│ Stack    │────────>│ 0x90000  │
└──────────┘         └──────────┘
```

---

## 10. Quick Reference Summary

**Paging**: Fixed-size blocks, simple, no external fragmentation

**Segmentation**: Variable-size blocks, logical structure, external fragmentation

**Modern**: Paged segmentation (segmentation for protection, paging for management)

