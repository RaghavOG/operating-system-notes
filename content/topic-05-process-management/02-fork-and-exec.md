# fork() and exec() - FAANG Classic

## Quick Reference (TL;DR)

**fork()**: Creates a copy of the current process. Returns twice (once in parent with child PID, once in child with 0). Uses **Copy-on-Write (COW)** for efficiency.

**exec()**: Replaces current process's memory with new program. Loads new code, data, stack. Process ID stays same.

**Why separate**: fork() creates process, exec() loads program. Separation allows setup (redirection, environment) before loading program.

---

## 1. Clear Definition

### fork()
The `fork()` system call creates a new process by **duplicating** the calling process. The new process (child) is an **exact copy** of the parent process, including memory, file descriptors, and execution state.

### exec()
The `exec()` family of system calls **replaces** the current process's memory image with a new program. The process ID remains the same, but the code, data, and stack are completely replaced.

💡 **Key Insight**: `fork()` creates a process; `exec()` loads a program. They're usually used together: `fork()` to create, `exec()` to run a different program.

---

## 2. Core Concepts

### What fork() Copies vs Shares

**Copied** (separate copies):
- **Memory**: Code, data, stack, heap (initially shared via COW, then copied on write)
- **File descriptors**: Child gets copies (but point to same files)
- **Process attributes**: PID, PPID, signal handlers
- **CPU state**: Registers, program counter

**Shared** (same resource):
- **Open files**: File descriptors point to same file table entries
- **File offsets**: Reading in one affects the other (unless repositioned)
- **Signal handlers**: Initially same (but can be changed)
- **Memory mappings**: Initially shared (COW)

**Example**:
```c
int x = 42;
pid_t pid = fork();

if (pid == 0) {
    // Child process
    x = 100;  // Modifies child's copy
    printf("Child: x = %d\n", x);  // Prints 100
} else {
    // Parent process
    printf("Parent: x = %d\n", x);  // Prints 42
}
```

### Copy-on-Write (COW)

**Mechanism**: When `fork()` is called, the OS doesn't immediately copy all memory. Instead:

1. **Mark pages as COW**: Both parent and child point to same physical pages, marked as read-only
2. **On write**: When either process writes to a page:
   - Page fault occurs (write to read-only page)
   - OS allocates new physical page
   - Copies original page content
   - Updates page table
   - Allows write to proceed

**Why COW**:
- **Efficiency**: Most processes don't modify all memory after fork()
- **Speed**: fork() is fast (just copy page tables, not memory)
- **Memory**: Saves memory (shared pages until modified)

**Example**:
```c
// After fork():
// Parent and child share same physical pages
// Both point to same memory (marked read-only)

// Child writes:
x = 100;  // Page fault!
// OS: Allocates new page, copies data, allows write
// Now parent and child have separate pages
```

**Cost**:
- **fork() without COW**: Copy entire address space (~milliseconds)
- **fork() with COW**: Copy page tables only (~microseconds)
- **First write**: Page fault + copy (~microseconds per page)

### Why fork() is Cheap

**Traditional thinking**: fork() must be expensive (copying entire process)

**Reality**: fork() is relatively cheap because:

1. **Copy-on-Write**: Only page tables are copied, not memory
2. **Lazy copying**: Memory is copied only when modified
3. **Shared pages**: Unmodified pages remain shared
4. **Optimized implementation**: Modern OSes optimize fork() heavily

**Typical costs**:
- **fork()**: ~10-100 microseconds (just page table copy)
- **First write**: ~1-10 microseconds per page (COW page fault)

**Comparison**:
- **Without COW**: ~1-10 milliseconds (copy 1GB address space)
- **With COW**: ~10-100 microseconds (copy page tables only)

### Why exec() Replaces Memory

**What exec() does**:

1. **Unmap old memory**: Remove all existing memory mappings
2. **Load new program**: Read executable file from disk
3. **Set up new address space**:
   - Code segment (text)
   - Data segment (initialized data, BSS)
   - Stack (initialized)
   - Heap (empty)
4. **Reset state**: Clear registers, set entry point
5. **Preserve**: Process ID, parent, some file descriptors (unless closed)

**Why replace (not append)**:
- **Security**: Old code shouldn't remain in memory
- **Simplicity**: Clean slate for new program
- **Efficiency**: No need to manage old memory
- **Correctness**: New program expects clean state

**Example**:
```c
// Before exec():
// Process has: browser code, data, stack

exec("/bin/ls", "ls", "-l", NULL);

// After exec():
// Process has: ls code, data, stack
// Browser code is gone
// Process ID is same
```

### Why fork() + exec() Instead of One Call?

🎯 **Interview Focus**: This is a classic question.

**Historical Reason**: Unix philosophy - "do one thing well"
- `fork()`: Creates process
- `exec()`: Loads program
- Separation allows flexibility

**Practical Reasons**:

1. **Setup before execution**:
   ```c
   pid_t pid = fork();
   if (pid == 0) {
       // Child: Set up environment
       close(0);  // Close stdin
       open("input.txt", O_RDONLY);  // Redirect to file
       close(1);  // Close stdout
       open("output.txt", O_WRONLY);  // Redirect to file
       
       // Now load program
       exec("/bin/program", "program", NULL);
   }
   ```

2. **Process management**:
   ```c
   pid_t pid = fork();
   if (pid == 0) {
       exec("/bin/program", "program", NULL);
   } else {
       // Parent: Can wait, monitor, or continue
       waitpid(pid, &status, 0);
   }
   ```

3. **Flexibility**: Can fork() without exec() (same program, different behavior)

4. **Efficiency**: Can optimize fork() and exec() separately

**Alternative (Windows)**: `CreateProcess()` combines both, but less flexible

**Unix way is better** because:
- More flexible (can setup between fork and exec)
- Follows Unix philosophy
- Allows process management before exec

---

## 3. Use Cases

### Common Patterns

1. **Shell executing commands**:
   ```c
   fork();
   if (child) {
       exec(command);
   } else {
       wait();
   }
   ```

2. **Process pools**: fork() multiple workers, each runs same program

3. **Daemon processes**: fork() to background, exec() daemon program

4. **Pipeline**: fork() for each stage, exec() different programs

---

## 4. Advantages & Disadvantages

### fork()

**Advantages**:
✅ **Fast**: COW makes it efficient  
✅ **Flexible**: Can setup before exec()  
✅ **Simple**: One call creates process

**Disadvantages**:
❌ **Confusing**: Returns twice  
❌ **Memory**: Initially shares memory (COW overhead on write)  
❌ **File descriptors**: Shared (can cause issues)

### exec()

**Advantages**:
✅ **Clean**: Fresh address space  
✅ **Secure**: Old code removed  
✅ **Simple**: One call loads program

**Disadvantages**:
❌ **Destructive**: Replaces entire process  
❌ **No return**: Can't go back to old program

---

## 5. Best Practices

1. **Always check fork() return**: Handle errors
2. **Close unused file descriptors**: Before exec()
3. **Use COW awareness**: Minimize writes after fork()
4. **Handle zombie processes**: Wait for children

---

## 6. Common Pitfalls

⚠️ **Mistake**: Not checking fork() return value

⚠️ **Mistake**: Forgetting that file descriptors are shared

⚠️ **Mistake**: Not understanding COW (thinking fork() copies everything)

⚠️ **Mistake**: Calling exec() without fork() (replaces current process)

---

## 7. Interview Tips

**Common Questions**:
1. "What does fork() do?"
2. "Explain Copy-on-Write."
3. "Why is fork() cheap?"
4. "Why fork() + exec() instead of one call?"

**Key Points**:
- fork() creates copy, exec() replaces
- COW makes fork() efficient
- fork() + exec() allows setup
- File descriptors are shared

---

## 8. Related Topics

- **Process Management** (Topic 5): Process creation
- **Memory Management** (Topic 11): COW, address space
- **System Calls** (Topic 4): How fork/exec work

---

## 9. Visual Aids

### fork() with COW

```
Before fork():
Parent Process
┌──────────────┐
│ Memory Pages │
└──────────────┘

After fork() (COW):
Parent Process        Child Process
┌──────────────┐      ┌──────────────┐
│ Page Tables  │      │ Page Tables  │
└──────┬───────┘      └──────┬───────┘
       │                     │
       └──────────┬──────────┘
                  │
         ┌────────▼────────┐
         │ Physical Pages  │  (shared, read-only)
         │  (COW marked)   │
         └─────────────────┘

After child writes:
Parent Process        Child Process
┌──────────────┐      ┌──────────────┐
│ Page Tables  │      │ Page Tables  │
└──────┬───────┘      └──────┬───────┘
       │                     │
       │                     │
┌──────▼──────┐      ┌──────▼──────┐
│Physical Page│      │Physical Page│  (separate)
│  (original) │      │   (copy)    │
└─────────────┘      └─────────────┘
```

### exec() Replacement

```
Before exec():
Process
┌──────────────┐
│ Browser Code │
│ Browser Data │
│ Browser Stack│
└──────────────┘

exec("/bin/ls"):

Process
┌──────────────┐
│   ls Code    │  ← Replaced
│   ls Data    │  ← Replaced
│   ls Stack   │  ← Replaced
└──────────────┘
(PID unchanged)
```

---

## 10. Quick Reference Summary

**fork()**: Creates process copy, returns twice, uses COW

**exec()**: Replaces process memory with new program

**COW**: Pages shared until written, then copied

**Why separate**: Allows setup between fork and exec

**Cost**: fork() ~10-100 μs (COW), exec() ~1-10 ms (load program)

