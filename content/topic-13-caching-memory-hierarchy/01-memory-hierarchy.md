# Caching & Memory Hierarchy

## Quick Reference (TL;DR)

**Memory Hierarchy**: Registers → L1 Cache → L2 Cache → L3 Cache → RAM → Disk. Faster but smaller as you go up. Exploits locality (temporal, spatial).

**Locality**: Temporal (recently used likely used again), Spatial (nearby addresses likely used). Caches exploit this.

**Cache Coherence**: Multiple CPUs have caches. Must keep them consistent. Protocols: MESI (Modified, Exclusive, Shared, Invalid).

**False Sharing**: Different variables in same cache line. One CPU writes, invalidates other CPU's cache. Performance problem.

---

## 1. Clear Definition

**Memory Hierarchy** is the organization of storage from fastest/smallest (registers) to slowest/largest (disk). Each level caches data from the level below.

**Purpose**: Bridge the speed gap between CPU and main memory. Exploit **locality** to keep frequently used data in fast storage.

---

## 2. Core Concepts

### Memory Hierarchy Levels

**Registers → Cache → RAM → Disk**:

| Level | Size | Speed | Cost |
|-------|------|-------|------|
| **Registers** | ~100 bytes | 1 cycle | Very high |
| **L1 Cache** | ~32-64 KB | 1-3 cycles | High |
| **L2 Cache** | ~256 KB - 1 MB | 10-20 cycles | Medium |
| **L3 Cache** | ~8-32 MB | 40-75 cycles | Medium |
| **RAM** | ~8-64 GB | 100-300 cycles | Low |
| **Disk** | ~1-10 TB | 10M cycles | Very low |

**Access Time**:
- Register: ~0.1 ns
- L1 Cache: ~0.5 ns
- L2 Cache: ~5 ns
- L3 Cache: ~20 ns
- RAM: ~100 ns
- Disk: ~10 ms (10,000,000 ns!)

### Locality

**Temporal Locality**:
- Recently accessed data likely accessed again soon
- Example: Loop variable, frequently called function
- **Exploitation**: Keep recently used data in cache

**Spatial Locality**:
- Data near recently accessed data likely accessed soon
- Example: Array elements, sequential memory access
- **Exploitation**: Cache loads blocks (cache lines), not single bytes

**Example**:
```c
// Temporal locality
for (int i = 0; i < 1000; i++) {
    sum += arr[i];  // 'sum' accessed repeatedly
}

// Spatial locality
for (int i = 0; i < 1000; i++) {
    sum += arr[i];  // arr[i], arr[i+1] nearby
}
```

### Cache Coherence

**Problem**: Multiple CPUs, each with own cache. Same memory location cached in multiple caches. One CPU writes → other caches become stale.

**Solution**: **Cache coherence protocols**

**MESI Protocol** (Modified, Exclusive, Shared, Invalid):

- **Modified**: Cache has exclusive copy, modified (dirty). Must write back to memory.
- **Exclusive**: Cache has exclusive copy, clean (matches memory).
- **Shared**: Multiple caches have copy, all clean.
- **Invalid**: Cache line invalid (stale or not present).

**State Transitions**:
```
CPU 1 reads: Invalid → Exclusive
CPU 2 reads: Exclusive → Shared (CPU 1)
CPU 1 writes: Shared → Modified (invalidate CPU 2)
CPU 2 reads: Modified → (CPU 1 writes back) → Shared
```

**Cost**: Cache coherence adds overhead (messages between CPUs).

### False Sharing

**Definition**: Different variables in **same cache line**. One CPU writes to one variable → invalidates other CPUs' cache lines → performance problem.

**Example**:
```c
struct {
    int x;  // CPU 1 uses this
    int y;  // CPU 2 uses this
} data;

// If x and y in same cache line (64 bytes):
// CPU 1 writes x → invalidates CPU 2's cache
// CPU 2 writes y → invalidates CPU 1's cache
// → Constant cache invalidation, poor performance!
```

**Solution**: **Padding** to separate into different cache lines
```c
struct {
    int x;
    char padding[60];  // Pad to cache line boundary
    int y;
} data;
```

**Detection**: High cache miss rate, low CPU utilization.

### Why Cache Makes Race Conditions Worse

**Problem**: CPU caches can hide writes from other CPUs.

**Example**:
```
CPU 1 Cache        Main Memory        CPU 2 Cache
counter=42         counter=0          counter=0
(written, but      (not yet)          (stale)
 not flushed)
```

**Solution**: **Memory barriers** force cache flush
```c
// Without barrier: Write may stay in cache
counter = 42;

// With barrier: Write visible to all CPUs
__atomic_store(&counter, 42, __ATOMIC_RELEASE);
```

**Why worse**: Without proper synchronization, caches can hide updates, making race conditions harder to detect and debug.

### Why LRU is Hard to Implement Perfectly

**Problem**: Need to track access order for all cache lines.

**Hardware Support**:
- Some CPUs have LRU bits
- But limited (2-4 bits per line)
- Approximations (not perfect LRU)

**Software Implementation**:
- Would need to track every access
- Too expensive (overhead > benefit)
- Use approximations (Clock algorithm, etc.)

**Reality**: Most caches use approximations (pseudo-LRU), not perfect LRU.

### Cache vs TLB

**Cache**: Stores **data** (memory contents)
- Caches memory values
- Hit: Data in cache
- Miss: Load from next level

**TLB (Translation Lookaside Buffer)**: Caches **translations** (virtual → physical addresses)
- Caches page table entries
- Hit: Translation in TLB
- Miss: Page table walk

**Both are caches**, but different purposes:
- **Cache**: What's in memory
- **TLB**: Where memory is

**Both exploit locality**:
- Cache: Temporal/spatial locality of data
- TLB: Locality of address translations

---

## 3. Use Cases

- High-performance computing
- Database systems
- Game engines
- Real-time systems

---

## 4. Advantages & Disadvantages

**Memory Hierarchy Advantages**:
✅ Fast access to frequently used data  
✅ Cost-effective (small fast cache, large slow memory)  
✅ Transparent to programs

**Disadvantages**:
❌ Complexity (coherence, consistency)  
❌ Cache misses are expensive  
❌ False sharing problems

---

## 5. Best Practices

1. **Exploit locality**: Sequential access, reuse data
2. **Avoid false sharing**: Pad shared data structures
3. **Use memory barriers**: For cache coherence
4. **Profile cache misses**: Measure performance

---

## 6. Common Pitfalls

⚠️ **Mistake**: Ignoring cache effects (assume memory is uniform)

⚠️ **Mistake**: False sharing (unintended cache line sharing)

⚠️ **Mistake**: Not understanding cache coherence

---

## 7. Interview Tips

**Common Questions**:
1. "Explain memory hierarchy."
2. "What is cache coherence?"
3. "What is false sharing?"
4. "Why does cache make race conditions worse?"

**Key Points**:
- Hierarchy: Fast/small → Slow/large
- Locality: Temporal and spatial
- Coherence: Keep caches consistent
- False sharing: Performance problem

---

## 8. Related Topics

- **Memory Management** (Topic 11): Address translation (TLB)
- **Virtual Memory** (Topic 12): Page tables, TLB

---

## 9. Visual Aids

### Memory Hierarchy

```
Speed ↑
      │
      │  Registers (fastest, smallest)
      │
      │  L1 Cache
      │
      │  L2 Cache
      │
      │  L3 Cache
      │
      │  RAM
      │
      │  Disk (slowest, largest)
      └──────────────────────────→ Size
```

### Cache Coherence (MESI)

```
CPU 1 Cache        Main Memory        CPU 2 Cache
[Modified]         [stale]            [Invalid]
counter=42         counter=0          (invalidated)
```

---

## 10. Quick Reference Summary

**Memory Hierarchy**: Registers → Cache → RAM → Disk (fast/small → slow/large)

**Locality**: Temporal (recent), Spatial (nearby)

**Cache Coherence**: Keep multiple caches consistent (MESI)

**False Sharing**: Different variables, same cache line (performance problem)

**Cache vs TLB**: Cache = data, TLB = address translations

