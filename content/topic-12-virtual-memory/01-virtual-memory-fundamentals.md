# Virtual Memory - Fundamentals

## Quick Reference (TL;DR)

**Virtual Memory**: Programs see more memory than physically available. Some pages in RAM, some on disk. MMU translates addresses, OS manages pages.

**Demand Paging**: Pages loaded into memory only when accessed (lazy loading). Page fault triggers loading from disk.

**Page Fault Lifecycle**: 1) MMU detects invalid access, 2) CPU traps to OS, 3) OS finds page on disk, 4) OS loads page to RAM, 5) OS updates page table, 6) Resume execution.

**Page Replacement**: When RAM full, evict page to make room. Algorithms: FIFO, LRU, Optimal, Clock.

---

## 1. Clear Definition

**Virtual Memory** is a memory management technique that allows programs to use more memory than physically available. The OS stores some pages in RAM and some on disk, transparently swapping them as needed.

**Key Benefits**:
- Programs can be larger than physical memory
- Multiple programs can run (each sees full address space)
- Simplifies programming (flat address space)

---

## 2. Core Concepts

### Why Virtual Memory Exists

**Problems without virtual memory**:
1. **Limited RAM**: Programs larger than RAM can't run
2. **Fragmentation**: Physical memory becomes fragmented
3. **Relocation**: Programs must be loaded at specific addresses
4. **Protection**: Hard to isolate processes

**Solutions virtual memory provides**:
1. **More memory than physical**: Pages on disk
2. **No external fragmentation**: Paging solves this
3. **Relocation**: Programs can run anywhere (MMU translates)
4. **Protection**: Page-level protection

### Demand Paging

**Definition**: Pages are loaded into memory **only when accessed** (lazy loading).

**How it works**:
1. Program starts: Only some pages loaded (code, initial data)
2. Program accesses page: MMU checks page table
3. If page in RAM: Access proceeds
4. If page not in RAM: **Page fault** occurs
5. OS loads page from disk to RAM
6. OS updates page table
7. Program resumes (retry access)

**Benefits**:
✅ Faster startup (don't load everything)  
✅ Only load what's needed  
✅ More programs can run

**Example**:
```
Program has 100 pages
Physical RAM: 20 frames
→ Only load 20 pages initially
→ Load more as needed (page faults)
```

### Page Fault Lifecycle (Exact Steps)

**Complete Process**:

1. **MMU detects invalid access**:
   - CPU tries to access virtual address
   - MMU looks up in page table
   - Page table entry: "Not present" or "Invalid"

2. **CPU traps to OS**:
   - Page fault exception
   - CPU switches to kernel mode
   - OS page fault handler runs

3. **OS checks access**:
   - Valid access? (within process address space)
   - Permission check (read/write/execute)
   - If invalid: Segmentation fault (kill process)

4. **OS finds page on disk**:
   - Check swap space / page file
   - Find page location on disk

5. **OS finds free frame** (if RAM full):
   - Check if free frame available
   - If not: Run page replacement algorithm
   - Evict page to make room

6. **OS loads page from disk**:
   - Read page from disk to RAM frame
   - Update page table (mark as present)
   - Set frame number

7. **OS updates page table**:
   - Set present bit
   - Set frame number
   - Set permissions

8. **Resume execution**:
   - Return from page fault handler
   - Retry the instruction that caused fault
   - Access now succeeds

**Cost**: ~1-10 milliseconds (disk I/O is slow!)

### Page Replacement

**Problem**: RAM is full, need to load new page. Which page to evict?

**Algorithms**:

**1. FIFO (First-In-First-Out)**:
- Evict oldest page
- Simple, but may evict frequently used pages
- **Belady's anomaly**: More frames can cause more page faults!

**2. LRU (Least Recently Used)**:
- Evict page not used for longest time
- Good performance (temporal locality)
- Hard to implement perfectly (need hardware support)

**3. Optimal**:
- Evict page that will be used farthest in future
- Optimal (minimum page faults)
- **Unusable**: Requires knowing future (not possible)

**4. Clock (Second Chance)**:
- Circular list of pages
- Clock hand sweeps, evicts pages with reference bit=0
- If reference bit=1, set to 0, give second chance
- Approximation of LRU

**Example (LRU)**:
```
Pages in memory: [A, B, C]
Access sequence: A, B, C, A, D

Page fault on D:
  - LRU: Evict C (least recently used)
  - New: [A, B, D]
```

### Belady's Anomaly

**Definition**: More frames can cause **more page faults (counterintuitive!)**.

**Example (FIFO, 3 frames)**:
```
Reference: 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5
Frames: 3

Timeline:
1: [1] (fault)
2: [1,2] (fault)
3: [1,2,3] (fault)
4: [2,3,4] (fault, evict 1)
1: [3,4,1] (fault, evict 2)
2: [4,1,2] (fault, evict 3)
5: [1,2,5] (fault, evict 4)
1: [1,2,5] (hit)
2: [1,2,5] (hit)
3: [2,5,3] (fault, evict 1)
4: [5,3,4] (fault, evict 2)
5: [5,3,4] (hit)

Total: 9 faults
```

**Example (FIFO, 4 frames)**:
```
Same reference, 4 frames → 10 faults (more!)
```

**Why**: FIFO doesn't consider usage, just arrival time.

**Solution**: Use stack-based algorithms (LRU, Optimal) - no anomaly.

### Thrashing

**Definition**: System spends more time swapping pages than executing.

**Cause**: Too many processes, not enough RAM
- Each process needs pages
- OS constantly swapping pages in/out
- CPU utilization drops (waiting for disk)
- System becomes unresponsive

**Symptoms**:
- High page fault rate
- Low CPU utilization
- Slow system response
- Disk I/O saturation

**Solution**:
- Reduce number of processes
- Add more RAM
- Improve locality (better algorithms)

### Working Set Model

**Definition**: Set of pages a process is actively using.

**Working Set**: Pages accessed in last T time units.

**Purpose**: 
- Keep working set in memory
- Prevents thrashing
- Improves performance

**Example**:
```
Process working set: {Page 1, Page 3, Page 7}
→ Keep these in memory
→ Swap out pages not in working set
```

### Page Size Trade-offs

**Small Pages (e.g., 4 KB)**:
✅ Less internal fragmentation  
✅ Better fit for small processes  
❌ More page table entries  
❌ More TLB misses  
❌ More page faults

**Large Pages (e.g., 2 MB)**:
✅ Fewer page table entries  
✅ Fewer TLB misses  
✅ Fewer page faults  
❌ More internal fragmentation  
❌ Waste for small processes

**Modern**: Usually 4 KB (small), with support for 2 MB/1 GB (large pages for big processes).

---

## 3. Use Cases

- Running programs larger than RAM
- Multiple programs simultaneously
- Simplifying memory management
- Process isolation

---

## 4. Advantages & Disadvantages

**Advantages**:
✅ More memory than physical  
✅ Multiple programs  
✅ Simplified programming  
✅ Protection

**Disadvantages**:
❌ Overhead (page faults, page tables)  
❌ Complexity  
❌ Performance (disk I/O slow)

---

## 5. Best Practices

1. **Understand page faults**: Know when they occur
2. **Choose replacement algorithm**: LRU is good
3. **Avoid thrashing**: Monitor page fault rate
4. **Consider page size**: 4KB is standard

---

## 6. Common Pitfalls

⚠️ **Mistake**: Not understanding page fault cost

⚠️ **Mistake**: Confusing page fault with segmentation fault

⚠️ **Mistake**: Not understanding Belady's anomaly

---

## 7. Interview Tips

**Common Questions**:
1. "What is virtual memory?"
2. "Explain page fault lifecycle."
3. "Compare page replacement algorithms."
4. "What is Belady's anomaly?"

**Key Points**:
- Virtual memory = more memory than physical
- Demand paging = load on access
- Page fault = expensive (disk I/O)
- LRU is good, Optimal is theoretical

---

## 8. Related Topics

- **Memory Management** (Topic 11): Paging, address translation
- **Caching** (Topic 13): TLB, cache hierarchy

---

## 9. Visual Aids

### Virtual Memory Layout

```
Virtual Address Space (Program sees)
┌─────────────────────────┐
│  Page 0 (in RAM)        │
│  Page 1 (in RAM)        │
│  Page 2 (on disk)       │
│  Page 3 (in RAM)        │
│  Page 4 (on disk)       │
└─────────────────────────┘
         │
         │ (MMU translates)
         ▼
Physical RAM              Disk
┌──────────┐            ┌──────────┐
│ Frame 0  │            │ Page 2   │
│ Frame 1  │            │ Page 4   │
│ Frame 2  │            │ ...      │
└──────────┘            └──────────┘
```

### Page Fault Flow

```
CPU: Access page
  ↓
MMU: Page not in RAM
  ↓
CPU: Page fault exception
  ↓
OS: Find page on disk
  ↓
OS: Find free frame (or evict)
  ↓
OS: Load page from disk
  ↓
OS: Update page table
  ↓
CPU: Retry access (succeeds)
```

---

## 10. Quick Reference Summary

**Virtual Memory**: More memory than physical, pages on disk

**Demand Paging**: Load pages when accessed

**Page Fault**: Expensive (~1-10 ms), triggers page load

**Page Replacement**: LRU is good, Optimal is theoretical

**Thrashing**: Too many page faults, system slow

