# Synchronization Primitives - Overview

## Quick Reference (TL;DR)

**Mutex**: Mutual exclusion lock. Only one thread can hold it. Blocking (sleeps when locked).

**Semaphore**: Counter-based synchronization. Can allow N threads. Binary (0/1) or counting (N).

**Spinlock**: Busy-wait lock. Spins in loop until available. Good for short critical sections.

**RW Lock**: Multiple readers OR one writer. Optimizes read-heavy workloads.

**Condition Variables**: Wait for condition to become true. Used with mutex.

**Futex**: Linux fast userspace mutex. Hybrid (user-space fast path, kernel slow path).

---

## 1. Clear Definition

**Synchronization Primitives** are mechanisms to coordinate access to shared resources among multiple threads. They ensure **mutual exclusion** and **ordering** of operations.

**Purpose**: Prevent race conditions, ensure correctness, coordinate threads.

---

## 2. Core Concepts

### Mutex (Mutual Exclusion)

**Definition**: A lock that ensures only one thread can hold it at a time.

**Operations**:
- `lock()`: Acquire lock (blocks if held)
- `unlock()`: Release lock

**Properties**:
- **Blocking**: Thread sleeps if lock is held
- **Ownership**: Only lock holder can unlock
- **Reentrant**: Some mutexes allow same thread to lock multiple times

**Example**:
```c
pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;

void critical_section() {
    pthread_mutex_lock(&lock);
    // Only one thread here at a time
    shared_data++;
    pthread_mutex_unlock(&lock);
}
```

### Semaphore

**Definition**: A counter that controls access to a resource. Can allow N threads simultaneously.

**Types**:
- **Binary semaphore**: Value 0 or 1 (like mutex, but no ownership)
- **Counting semaphore**: Value 0 to N (allows N concurrent accesses)

**Operations**:
- `wait()` / `P()`: Decrement (blocks if 0)
- `signal()` / `V()`: Increment (wakes waiting thread)

**Example**:
```c
sem_t sem;
sem_init(&sem, 0, 3);  // Allow 3 concurrent accesses

void access_resource() {
    sem_wait(&sem);  // Decrement, block if 0
    // Use resource (up to 3 threads here)
    sem_post(&sem);  // Increment, wake waiting thread
}
```

### Spinlock

**Definition**: A lock that **busy-waits** (spins in a loop) until the lock becomes available.

**Characteristics**:
- **Non-blocking**: Thread doesn't sleep, keeps checking
- **CPU-intensive**: Wastes CPU cycles
- **Fast**: No context switch overhead

**When to use**:
- Short critical sections (< few microseconds)
- Cannot sleep (interrupt handlers, kernel code)
- Low contention (lock rarely held)

**Example**:
```c
spinlock_t lock;
spin_lock(&lock);
// Short critical section
spin_unlock(&lock);
```

### RW Lock (Reader-Writer Lock)

**Definition**: Allows multiple **readers** OR one **writer** (not both).

**Modes**:
- **Read lock**: Multiple threads can hold simultaneously
- **Write lock**: Exclusive (only one thread)

**Use case**: Read-heavy workloads (databases, caches)

**Example**:
```c
pthread_rwlock_t rwlock = PTHREAD_RWLOCK_INITIALIZER;

// Readers
pthread_rwlock_rdlock(&rwlock);
read_data();
pthread_rwlock_unlock(&rwlock);

// Writer
pthread_rwlock_wrlock(&rwlock);
write_data();
pthread_rwlock_unlock(&rwlock);
```

### Condition Variables

**Definition**: Allows threads to wait for a **condition** to become true.

**Operations**:
- `wait(condition, mutex)`: Wait for condition (releases mutex, sleeps)
- `signal(condition)`: Wake one waiting thread
- `broadcast(condition)`: Wake all waiting threads

**Must use with mutex**: Prevents race conditions

**Example**:
```c
pthread_cond_t cond = PTHREAD_COND_INITIALIZER;
pthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;

// Waiter
pthread_mutex_lock(&mutex);
while (!condition) {
    pthread_cond_wait(&cond, &mutex);  // Releases mutex, waits
}
// Condition is true
pthread_mutex_unlock(&mutex);

// Signaler
pthread_mutex_lock(&mutex);
condition = true;
pthread_cond_signal(&cond);  // Wake waiter
pthread_mutex_unlock(&mutex);
```

### Futex (Fast Userspace Mutex)

**Linux-specific**: Hybrid mutex implementation.

**How it works**:
1. **Fast path** (user space): Try to acquire lock atomically
2. **Slow path** (kernel): If contention, use kernel wait queue

**Benefits**:
- Fast when no contention (no system call)
- Efficient when contention (kernel handles waiting)

**Example**: Used by `pthread_mutex` on Linux

---

## 3. Use Cases

### Mutex
- Protecting shared data structures
- Critical sections
- General synchronization

### Semaphore
- Resource pools (database connections, threads)
- Producer-consumer (bounded buffer)
- Limiting concurrency

### Spinlock
- Kernel code
- Very short critical sections
- Interrupt handlers

### RW Lock
- Read-heavy data structures
- Databases, caches
- Configuration that's mostly read

### Condition Variables
- Producer-consumer
- Waiting for events
- Thread coordination

---

## 4. Advantages & Disadvantages

### Mutex vs Semaphore

| Aspect | Mutex | Semaphore |
|--------|-------|-----------|
| **Ownership** | Yes (only holder unlocks) | No |
| **Value** | Binary (0/1) | Counting (0-N) |
| **Use case** | Mutual exclusion | Resource counting |
| **Reentrant** | Can be | No |

### Spinlock vs Mutex

| Aspect | Spinlock | Mutex |
|--------|----------|-------|
| **Waiting** | Busy-wait (spins) | Blocks (sleeps) |
| **CPU usage** | High (wastes cycles) | Low (sleeps) |
| **Overhead** | Low (no context switch) | Higher (context switch) |
| **Use case** | Short sections | Longer sections |

**When spinlocks are better**:
- Critical section < few microseconds
- Cannot sleep (kernel, interrupts)
- Low contention
- Multi-core system

**When mutex is better**:
- Longer critical sections
- High contention
- Can sleep

### Busy Waiting vs Blocking

**Busy Waiting** (spinlock):
- Thread keeps checking lock
- Wastes CPU cycles
- Fast (no context switch)
- Use for very short waits

**Blocking** (mutex):
- Thread sleeps, gives up CPU
- Efficient (no CPU waste)
- Slower (context switch overhead)
- Use for longer waits

---

## 5. Best Practices

1. **Hold locks briefly**: Minimize critical section
2. **Avoid nested locks**: Prevent deadlocks
3. **Use appropriate primitive**: Match to use case
4. **Always unlock**: Use RAII, try-finally

---

## 6. Common Pitfalls

⚠️ **Mistake**: Deadlock (holding multiple locks)

⚠️ **Mistake**: Forgetting to unlock

⚠️ **Mistake**: Using wrong primitive

⚠️ **Mistake**: Holding lock too long

---

## 7. Interview Tips

**Common Questions**:
1. "Compare mutex vs semaphore."
2. "When would you use spinlock vs mutex?"
3. "Explain condition variables."
4. "What is a futex?"

**Key Points**:
- Mutex = mutual exclusion
- Semaphore = resource counting
- Spinlock = busy-wait
- Choose based on use case

---

## 8. Related Topics

- **Concurrency Fundamentals** (Topic 8): Why synchronization needed
- **Deadlocks** (Topic 10): Synchronization problems
- **Classic Problems** (Topic 9): Producer-consumer, etc.

---

## 9. Visual Aids

### Mutex Locking

```
Thread 1          Thread 2          Thread 3
   │                 │                 │
   │ lock()          │                 │
   ├─►[LOCKED]       │                 │
   │                 │ lock()          │
   │                 ├─►[BLOCKED]     │
   │                 │                 │ lock()
   │                 │                 ├─►[BLOCKED]
   │ unlock()        │                 │
   ├─►[UNLOCKED]     │                 │
   │                 ├─►[LOCKED]      │
   │                 │                 │
```

### Semaphore (Counting)

```
Semaphore (value=3)
    │
    ├─► Thread 1 (wait) → value=2
    ├─► Thread 2 (wait) → value=1
    ├─► Thread 3 (wait) → value=0
    ├─► Thread 4 (wait) → [BLOCKED] (value=0)
```

---

## 10. Quick Reference Summary

**Mutex**: One thread at a time, blocking

**Semaphore**: N threads, counting

**Spinlock**: Busy-wait, fast for short sections

**RW Lock**: Multiple readers OR one writer

**Condition Variables**: Wait for condition

**Futex**: Linux fast mutex (hybrid)

