Alright. Switching hats to **“global head engineer who has hired for FAANG, infra teams, kernels, databases, and distributed systems.”**
What follows is **not a syllabus** — it’s a **battle map**.
If you can reason through *every bullet below*, you’re operating at **FAANG OS bar**.

No stories, no teaching today.
Just the **complete, in-depth topic + subtopic + trap list**.

https://youtu.be/8XBtAjKwCm4?t=2550
https://www.codingshuttle.com/blogs/operating-systems-in-one-shot/

---

# OPERATING SYSTEMS — FAANG LEVEL MASTER LIST

---

## 1. OS PHILOSOPHY & DESIGN (they test thinking here)

* What problems OS actually solves (illusion vs control)
* OS as **resource allocator** vs **abstraction layer**
* Policy vs Mechanism (classic trap)
* Why OS is *not* just a library
* Kernel responsibilities vs userland responsibilities
* Why OS design is full of trade-offs, not “best solutions”

### Tricky Comparisons

* OS vs Runtime (JVM, Node)
* OS threads vs Green threads
* Kernel abstraction vs Hardware abstraction

---

## 2. KERNEL ARCHITECTURE (deep FAANG favorite)

* Monolithic kernel
* Microkernel
* Hybrid kernel
* Exokernel (rare but gold)

### Tricky Questions

* Why Linux survived despite monolithic design?
* Why microkernels didn’t dominate?
* Cost of IPC in microkernels
* Why modern kernels blur the boundaries

### Comparisons

* Monolithic vs Microkernel (performance vs safety)
* Kernel modules vs static kernel
* System call vs library call

---

## 3. USER MODE vs KERNEL MODE (non-negotiable)

* CPU privilege levels (rings)
* Why kernel mode exists
* What kernel mode *can* do that user mode can’t
* How privilege escalation bugs happen

### Tricky Questions

* Why system calls are slower than normal function calls
* Why we don’t allow user programs to disable interrupts
* Can kernel code crash the OS? Why?

---

## 4. SYSTEM CALLS & CONTEXT TRANSITION

* What triggers a system call
* Trap instruction
* User → Kernel → User transition
* Cost of a system call
* Fast system calls (`sysenter`, `syscall`)

### Traps

* System call vs interrupt vs exception
* Why syscalls are not interrupts
* Why context switching is expensive even today

---

## 5. PROCESS MANAGEMENT (heavy grilling zone)

* Process definition (address space + execution state)
* Process lifecycle (realistic, not textbook)
* PCB contents (exact)
* Context switch (exact steps)
* CPU burst vs IO burst

### fork / exec (FAANG classic)

* What fork copies vs shares
* Copy-on-write
* Why fork is cheap
* Why exec replaces memory

### Tricky Questions

* Why fork + exec instead of one call?
* Why zombie processes exist
* Orphan vs zombie
* Can a process exist without a thread?

---

## 6. THREADS (extremely important)

* Thread as unit of execution
* Thread states
* Thread context vs process context
* TLS (Thread Local Storage)

### Thread Models

* User-level threads
* Kernel-level threads
* M:N threading model

### Tricky Questions

* Why threads are faster than processes
* Why thread context switch is cheaper
* Can threads run on different cores?
* What breaks when one thread crashes?

### Comparisons

* Thread vs Process
* Thread vs Coroutine
* Thread vs Async IO

---

## 7. CPU SCHEDULING (they test math + reasoning)

* Scheduling goals
* Preemptive vs Non-preemptive
* Fairness vs Throughput vs Latency
* CPU affinity

### Algorithms (must know deeply)

* FCFS
* SJF / SRTF
* Priority Scheduling
* Round Robin
* Multilevel Queue
* Multilevel Feedback Queue

### Tricky Questions

* Why SJF is optimal yet unusable
* Starvation vs Deadlock
* Convoy effect
* Effect of time quantum on RR

### FAANG-Level

* Linux CFS (Completely Fair Scheduler)
* Virtual runtime
* Why modern schedulers avoid strict priority

---

## 8. CONCURRENCY FUNDAMENTALS (core filter)

* Critical section
* Atomicity
* Visibility
* Ordering

### Race Conditions

* Read-modify-write hazards
* Lost updates
* Memory reordering issues

### Tricky Questions

* Why volatile is not a lock
* Why atomic ≠ thread-safe
* Why race conditions are nondeterministic

---

## 9. SYNCHRONIZATION PRIMITIVES (expect grilling)

* Mutex
* Semaphore (binary, counting)
* Spinlock
* RW Lock
* Monitor
* Condition variables
* Futex (Linux)

### Tricky Questions

* Mutex vs Semaphore
* Spinlock vs Mutex
* Busy waiting vs Blocking
* When spinlocks are better

### Classic Problems

* Producer–Consumer
* Reader–Writer
* Dining Philosophers
* Sleeping Barber

---

## 10. DEADLOCKS (logic test)

* Deadlock definition
* Necessary conditions
* Circular wait graph

### Handling Strategies

* Prevention
* Avoidance
* Detection
* Recovery

### Banker’s Algorithm

* Safe vs Unsafe state
* Why unsafe ≠ deadlock

### Tricky Questions

* Deadlock vs Starvation
* Why deadlocks are rare in modern OS
* Why timeouts are practical deadlock handling

---

## 11. MEMORY MANAGEMENT (very high ROI)

* Logical vs Physical memory
* Address translation
* Binding times
* MMU role

### Allocation

* Contiguous allocation
* Internal vs External fragmentation
* Compaction

### Paging

* Pages, frames
* Page tables
* Multi-level page tables
* Inverted page tables

### Segmentation

* Logical view of memory
* Paging vs Segmentation

---

## 12. VIRTUAL MEMORY (FAANG core concept)

* Why virtual memory exists
* Demand paging
* Page fault lifecycle (exact steps)

### Page Replacement

* FIFO
* LRU
* Optimal
* Clock (Second chance)

### Tricky Questions

* Belady’s anomaly
* Thrashing
* Working set model
* Page size trade-offs

---

## 13. CACHING & MEMORY HIERARCHY

* Registers → Cache → RAM → Disk
* Locality (temporal, spatial)
* Cache coherence
* False sharing

### Tricky Questions

* Why cache makes race conditions worse
* Why LRU is hard to implement perfectly
* Cache vs TLB

---

## 14. FILE SYSTEMS (practical FAANG angle)

* File abstraction
* File metadata
* File descriptors
* Open file table

### Directory Structures

* Single level
* Tree
* DAG

### Allocation

* Contiguous
* Linked
* Indexed

### Linux Focus

* Inode structure
* Hard link vs Soft link
* File permissions

---

## 15. DISK & IO SYSTEMS

* Disk geometry
* Seek time vs Latency vs Transfer time

### Scheduling

* FCFS
* SSTF
* SCAN
* C-SCAN
* LOOK

### IO Techniques

* Buffering
* Caching
* Spooling
* DMA

---

## 16. SECURITY & PROTECTION

* Protection vs Security
* Access control matrix
* Capabilities vs ACLs
* Privilege escalation

### Tricky Questions

* Why kernel bugs are fatal
* Why sandboxing works
* Why containers are not VMs

---

## 17. VIRTUALIZATION & CONTAINERS (FAANG crossover)

* Virtual machines
* Hypervisors (Type 1 vs Type 2)
* Containers vs VMs
* Namespaces
* cgroups

### Tricky Questions

* Why containers are faster
* Why containers share kernel
* Why containers are weaker isolation

---

## 18. MODERN OS INTERVIEW SCENARIOS

* How OS handles 10k concurrent connections
* How OS schedules web server threads
* How memory leaks affect OS
* What happens when RAM is full
* What happens when process crashes

---

## 19. CLASSIC COMPARISON QUESTIONS (MUST PREPARE)

* Process vs Thread
* Mutex vs Semaphore
* Deadlock vs Starvation
* Paging vs Segmentation
* Kernel thread vs User thread
* Blocking vs Non-blocking
* Synchronous vs Asynchronous
* Spinlock vs Mutex
* Cache vs Buffer
* VM vs Container

---

## 20. FINAL FAANG FILTER QUESTIONS

* Why OS design is about compromises
* Why abstractions leak
* Why OS can never be fully secure
* Why performance tuning often breaks correctness
* Why distributed systems problems resemble OS problems

---

### Reality Check (senior advice)

If you **memorize** this → rejection.
If you **reason through trade-offs** → hire.

Next step options:

* Convert this into **15-day FAANG OS drill plan**
* Give **top 50 FAANG OS questions with expected reasoning**
* Do **mock OS interview** where I grill you brutally

This list is the ceiling.
