# Disk & I/O Systems - Fundamentals

## Quick Reference (TL;DR)

**Disk Geometry**: Tracks (concentric circles), Sectors (arcs on track), Cylinders (same track across platters). Seek time = move head, Latency = rotation, Transfer = read/write data.

**Disk Scheduling**: FCFS, SSTF (shortest seek), SCAN (elevator), C-SCAN (circular), LOOK (SCAN without going to end). Goal: Minimize seek time.

**I/O Techniques**: Buffering (temporary storage), Caching (frequently used), Spooling (queue for slow devices), DMA (Direct Memory Access, CPU-free transfer).

---

## 1. Clear Definition

**Disk I/O Systems** manage how data is stored on and retrieved from storage devices (hard drives, SSDs). The OS schedules disk requests to optimize performance and provides buffering/caching for efficiency.

---

## 2. Core Concepts

### Disk Geometry

**Physical Structure** (traditional HDD):
- **Platters**: Circular disks (multiple stacked)
- **Tracks**: Concentric circles on platter
- **Sectors**: Arcs on track (typically 512 bytes or 4 KB)
- **Cylinders**: Same track across all platters
- **Read/Write Head**: Moves to access tracks

**SSD**: No moving parts, different structure (flash memory cells).

### Seek Time vs Latency vs Transfer Time

**Seek Time**:
- Time to move head to correct track
- HDD: ~3-15 ms (mechanical movement)
- SSD: ~0.1 ms (no moving parts)

**Rotational Latency**:
- Time for disk to rotate to correct sector
- HDD: Average = half rotation = ~4-8 ms (at 7200 RPM)
- SSD: N/A (no rotation)

**Transfer Time**:
- Time to read/write data
- Depends on: Data size, rotation speed, data density
- Typically: ~0.1-1 ms per sector

**Total Access Time** = Seek + Latency + Transfer

**Example (HDD)**:
```
Seek: 8 ms
Latency: 4 ms (average)
Transfer: 0.5 ms (1 sector)
Total: 12.5 ms
```

### Disk Scheduling Algorithms

**Goal**: Minimize seek time (largest component of access time).

**1. FCFS (First-Come-First-Served)**:
- Process requests in arrival order
- Simple, but poor performance
- No optimization

**2. SSTF (Shortest Seek Time First)**:
- Always serve request closest to current head position
- Good performance
- **Problem**: Starvation (requests far away may never be served)

**3. SCAN (Elevator Algorithm)**:
- Head moves in one direction, serves all requests
- Reaches end, reverses direction
- Fair (no starvation)
- Good performance

**4. C-SCAN (Circular SCAN)**:
- Like SCAN, but returns to start immediately (doesn't serve on return)
- More uniform wait times
- Better for systems with many requests

**5. LOOK**:
- Like SCAN, but reverses at last request (doesn't go to end)
- More efficient (less unnecessary movement)

**Comparison**:
| Algorithm | Performance | Fairness | Starvation |
|-----------|-------------|----------|------------|
| FCFS | Poor | Good | No |
| SSTF | Good | Poor | Yes |
| SCAN | Good | Good | No |
| C-SCAN | Good | Good | No |
| LOOK | Good | Good | No |

### I/O Techniques

**Buffering**:
- Temporary storage for data
- Smooths out speed differences
- Example: Keyboard input buffered before processing

**Caching**:
- Store frequently accessed data in fast memory
- Reduces disk I/O
- Example: File system cache (RAM)

**Spooling** (Simultaneous Peripheral Operations On-Line):
- Queue for slow devices (printers)
- Process can continue while I/O happens
- Example: Print spooler

**DMA (Direct Memory Access)**:
- Hardware transfers data directly to/from memory
- **CPU doesn't participate** (freed for other work)
- Much faster than programmed I/O (CPU does transfer)

**DMA Process**:
1. CPU sets up DMA transfer (source, destination, size)
2. DMA controller performs transfer
3. DMA interrupts CPU when done
4. CPU continues other work during transfer

**Benefits**:
- CPU free during transfer
- Faster (hardware optimized)
- Better system performance

---

## 3. Use Cases

- File systems
- Database systems
- Virtual memory (swap)
- Logging systems

---

## 4. Advantages & Disadvantages

**Disk Scheduling Advantages**:
✅ Reduces seek time  
✅ Improves throughput  
✅ Better fairness (some algorithms)

**Disadvantages**:
❌ Complexity  
❌ May not optimize for all workloads

**DMA Advantages**:
✅ Frees CPU  
✅ Faster transfers  
✅ Better performance

**Disadvantages**:
❌ Hardware complexity  
❌ Cache coherence issues

---

## 5. Best Practices

1. **Choose appropriate algorithm**: Based on workload
2. **Use DMA**: When available
3. **Cache frequently used data**: Reduce disk I/O
4. **Monitor disk performance**: Identify bottlenecks

---

## 6. Common Pitfalls

⚠️ **Mistake**: Not understanding seek time importance

⚠️ **Mistake**: Ignoring starvation in SSTF

⚠️ **Mistake**: Not using DMA when available

---

## 7. Interview Tips

**Common Questions**:
1. "Compare disk scheduling algorithms."
2. "What is DMA?"
3. "Explain seek time vs latency."

**Key Points**:
- Seek time is largest component
- SCAN/LOOK are good (fair, efficient)
- DMA frees CPU
- Buffering/caching improve performance

---

## 8. Related Topics

- **File Systems** (Topic 14): How files stored on disk
- **Virtual Memory** (Topic 12): Swap to disk

---

## 9. Visual Aids

### Disk Scheduling (SCAN)

```
Tracks: 0 ────────────────────────── 199
Head:    →→→→→→→→→→→→→→→→→→→→→→→→→→→
Requests: ●     ●  ●        ●     ●
          Serve all, then reverse
```

### DMA Transfer

```
CPU: Set up DMA
  ↓
DMA Controller: Transfer data
  │ (CPU free to do other work)
  ↓
DMA: Interrupt CPU when done
  ↓
CPU: Handle completion
```

---

## 10. Quick Reference Summary

**Disk Access Time**: Seek + Latency + Transfer

**Scheduling**: SCAN/LOOK are good (fair, efficient)

**DMA**: Hardware transfer, frees CPU

**Buffering/Caching**: Improve performance

