# Modern OS Interview Scenarios

## Quick Reference (TL;DR)

**10k Concurrent Connections**: Use epoll/kqueue (event-driven), non-blocking I/O, thread pool. OS limits: file descriptors, memory.

**Web Server Thread Scheduling**: Thread pool, event loop, I/O multiplexing. Balance threads vs processes.

**Memory Leaks**: Process memory grows, OS swaps pages, system slows. Eventually OOM killer.

**RAM Full**: OS swaps pages to disk, system slows (thrashing). OOM killer may kill processes.

**Process Crash**: OS cleans up (memory, file descriptors, children). Parent notified (SIGCHLD). Core dump optional.

---

## 1. Clear Definition

**Modern OS Interview Scenarios** are real-world questions about how OS handles common situations. These test understanding of OS mechanisms in practice.

---

## 2. Core Concepts

### How OS Handles 10k Concurrent Connections

**Challenge**: Traditional approach (one thread/process per connection) doesn't scale.

**Solution**: **Event-driven I/O** (epoll/kqueue)

**Mechanisms**:

1. **epoll (Linux) / kqueue (BSD)**:
   - Monitor many file descriptors efficiently
   - O(1) notification (not O(n) like select())
   - Edge-triggered or level-triggered

2. **Non-blocking I/O**:
   - Don't block thread waiting for I/O
   - Return immediately, check later
   - Allows one thread to handle many connections

3. **Thread Pool**:
   - Small number of worker threads
   - Each handles multiple connections
   - Better than one thread per connection

**Example Architecture**:
```
Main Thread (event loop)
  ├─ epoll_wait() → get ready connections
  ├─ Dispatch to worker threads
  └─ Worker threads handle I/O (non-blocking)
```

**OS Limits**:
- **File descriptors**: `ulimit -n` (default ~1024, need to increase)
- **Memory**: Each connection uses memory
- **Ports**: TCP ports (but connections can share ports)

**Optimizations**:
- Increase file descriptor limit
- Use SO_REUSEPORT (Linux)
- Tune TCP parameters (keepalive, timeouts)

### How OS Schedules Web Server Threads

**Web Server Architecture**:

1. **Thread Pool Model**:
   - Fixed number of worker threads
   - Main thread accepts connections
   - Dispatches to worker threads
   - OS scheduler manages threads

2. **Event Loop Model**:
   - Single or few threads
   - Event-driven (epoll)
   - Non-blocking I/O
   - OS scheduler less involved (mostly I/O waiting)

**Scheduling Considerations**:
- **I/O-bound**: Threads mostly waiting (I/O)
- **CPU-bound**: Threads need CPU time
- **Balance**: Enough threads for parallelism, not too many (overhead)

**OS Scheduler Role**:
- **CFS (Linux)**: Fair scheduling
- **I/O threads**: Mostly in WAITING state (blocked on I/O)
- **CPU threads**: Get CPU time when ready

**Optimization**:
- **CPU affinity**: Pin threads to cores (reduce migration)
- **Priority**: I/O threads may get priority
- **cgroups**: Limit resource usage

### How Memory Leaks Affect OS

**Memory Leak**: Process allocates memory but never frees it.

**Impact on Process**:
1. Process memory grows
2. More page faults (if exceeds RAM)
3. Slower execution (swapping)
4. Eventually: OOM killer terminates process

**Impact on System**:
1. **RAM fills up**: Less memory for other processes
2. **Swapping increases**: Pages moved to disk
3. **System slows**: Thrashing (constant swapping)
4. **Other processes affected**: Less memory available

**OS Response**:
- **Swap to disk**: Move pages to swap space
- **OOM Killer**: Kill process if memory exhausted
- **Memory pressure**: System becomes unresponsive

**Detection**:
- Monitor process memory usage
- Check swap usage
- System becomes slow

### What Happens When RAM is Full

**Scenario**: All physical RAM is used, new page needed.

**Process**:

1. **Page Fault Occurs**:
   - Process accesses page not in RAM
   - Page fault exception

2. **OS Finds Free Frame**:
   - Check if free frame available
   - If not: Run **page replacement algorithm**

3. **Page Replacement**:
   - Choose page to evict (LRU, etc.)
   - If page dirty: Write to disk (swap)
   - If page clean: Just remove (can reload from file)

4. **Load New Page**:
   - Read from disk (swap or file)
   - Update page table
   - Resume execution

**System Behavior**:
- **Thrashing**: Constant swapping, system slow
- **High I/O**: Disk I/O saturated
- **Low CPU utilization**: Processes waiting for I/O
- **Unresponsive**: System appears frozen

**Mitigation**:
- **Add RAM**: More physical memory
- **Reduce processes**: Fewer running processes
- **Improve locality**: Better algorithms
- **OOM Killer**: Kill memory-hungry processes

### What Happens When Process Crashes

**Crash Types**:
- **Segmentation fault**: Invalid memory access
- **Abort**: Assertion failure, unhandled exception
- **Signal**: SIGSEGV, SIGABRT, etc.

**OS Response**:

1. **Signal Delivery**:
   - OS sends signal to process
   - Default handler terminates process

2. **Cleanup**:
   - **Memory**: Deallocate process memory
   - **File descriptors**: Close all open files
   - **Children**: Orphan or terminate (depends on setup)
   - **Locks**: Release held locks (kernel handles)

3. **Notify Parent**:
   - Send **SIGCHLD** to parent
   - Parent can call `wait()` to get exit status

4. **Core Dump** (if enabled):
   - Write process memory to core file
   - For debugging
   - Can be large (full address space)

5. **Zombie Process**:
   - Process becomes zombie
   - Remains until parent calls `wait()`
   - Minimal resources (just PCB)

**Example Flow**:
```
Process crashes (segfault)
  ↓
OS: Signal SIGSEGV
  ↓
OS: Terminate process
  ↓
OS: Cleanup (memory, files, etc.)
  ↓
OS: Send SIGCHLD to parent
  ↓
OS: Process becomes zombie
  ↓
Parent: wait() → reaps zombie
```

**Impact**:
- **Process**: Terminated
- **Parent**: Notified (can handle)
- **System**: Resources freed
- **Other processes**: Unaffected (isolation)

---

## 3. Use Cases

- High-performance servers
- System administration
- Debugging
- Performance tuning

---

## 4. Advantages & Disadvantages

**Event-driven I/O Advantages**:
✅ Scales to many connections  
✅ Efficient (no thread per connection)  
✅ Good performance

**Disadvantages**:
❌ More complex  
❌ Requires non-blocking I/O

**Memory Leak Disadvantages**:
❌ System slowdown  
❌ Resource exhaustion  
❌ Process termination

---

## 5. Best Practices

1. **Use event-driven I/O**: For high concurrency
2. **Monitor memory**: Detect leaks early
3. **Handle crashes**: Proper error handling
4. **Set limits**: Prevent resource exhaustion

---

## 6. Common Pitfalls

⚠️ **Mistake**: One thread per connection (doesn't scale)

⚠️ **Mistake**: Ignoring memory leaks

⚠️ **Mistake**: Not handling process crashes

---

## 7. Interview Tips

**Common Questions**:
1. "How would you handle 10k concurrent connections?"
2. "What happens when RAM is full?"
3. "What happens when a process crashes?"

**Key Points**:
- Event-driven I/O (epoll/kqueue)
- Page replacement when RAM full
- OS cleans up crashed processes
- Understand OS mechanisms

---

## 8. Related Topics

- **Process Management** (Topic 5): Process lifecycle, crashes
- **Virtual Memory** (Topic 12): Swapping, page replacement
- **File Systems** (Topic 14): File descriptors
- **System Calls** (Topic 4): I/O operations

---

## 9. Visual Aids

### 10k Connections Architecture

```
Clients (10,000)
    │
    ▼
Main Thread (epoll)
    │
    ├─> Worker Thread 1 (handles 1000)
    ├─> Worker Thread 2 (handles 1000)
    ├─> ...
    └─> Worker Thread 10 (handles 1000)
```

### RAM Full Scenario

```
RAM (Full)
  │
  │ New page needed
  ▼
Page Replacement
  │
  ├─> Evict page (write to swap if dirty)
  └─> Load new page (from swap/file)
```

---

## 10. Quick Reference Summary

**10k Connections**: Event-driven I/O (epoll), non-blocking, thread pool

**Web Server Scheduling**: Thread pool, event loop, OS scheduler manages

**Memory Leaks**: Process grows, system swaps, OOM killer

**RAM Full**: Page replacement, swapping, thrashing

**Process Crash**: OS cleans up, notifies parent, zombie until wait()

