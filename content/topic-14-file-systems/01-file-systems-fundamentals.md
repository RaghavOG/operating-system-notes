# File Systems - Fundamentals

## Quick Reference (TL;DR)

**File**: Named collection of data. Abstraction over disk blocks. OS provides file interface (open, read, write, close).

**File Descriptor**: Integer handle to open file. Points to file table entry, which points to inode (Linux) or file control block.

**Inode**: Metadata about file (size, permissions, pointers to data blocks). Linux uses inodes.

**Directory**: Special file mapping names to inodes. Tree structure (hierarchical).

**Hard Link vs Soft Link**: Hard link = same inode (multiple names), Soft link = separate file pointing to target.

---

## 1. Clear Definition

A **file system** is how the OS organizes and stores files on storage devices (disks). It provides:
- **File abstraction**: Named data, not raw disk blocks
- **Directory structure**: Hierarchical organization
- **Metadata**: Size, permissions, timestamps
- **Access control**: Who can read/write

---

## 2. Core Concepts

### File Abstraction

**What is a file**:
- Named collection of data
- Persistent (survives reboots)
- Abstracted from disk blocks
- Has metadata (size, permissions, etc.)

**File Operations**:
- `open()`: Get file descriptor
- `read()`: Read data from file
- `write()`: Write data to file
- `close()`: Release file descriptor
- `seek()`: Move file pointer

**Example**:
```c
int fd = open("file.txt", O_RDONLY);  // Open file
char buffer[100];
read(fd, buffer, 100);  // Read 100 bytes
close(fd);  // Close file
```

### File Metadata

**Information stored**:
- **Size**: File size in bytes
- **Permissions**: Read, write, execute (owner, group, others)
- **Timestamps**: Created, modified, accessed
- **Owner**: User ID, group ID
- **Type**: Regular file, directory, symlink, etc.
- **Location**: Pointers to data blocks

**Where stored**: **Inode** (Linux) or **File Control Block** (Windows)

### File Descriptors

**Definition**: Integer handle returned by `open()`. Used for all file operations.

**Structure**:
```
Process
  ├─ File Descriptor Table (per process)
  │   0: stdin
  │   1: stdout
  │   2: stderr
  │   3: file.txt (points to...)
  │
  └─> System-wide Open File Table
       └─> Inode Table
            └─> File data blocks
```

**Operations**:
- `open()`: Creates entry in file descriptor table
- `read()/write()`: Use file descriptor
- `close()`: Removes entry, may close file if last reference

**Inheritance**: Child processes inherit file descriptors (after fork()).

### Open File Table

**System-wide table**: Tracks all open files.

**Information**:
- File pointer (current position)
- Open mode (read, write, append)
- Reference count (how many processes have it open)
- Pointer to inode

**Purpose**: 
- Share file state between processes
- Track file usage
- Manage file locks

### Directory Structures

**Single Level**:
- All files in one directory
- Simple, but no organization
- Example: Early systems

**Tree**:
- Hierarchical (directories contain files/subdirectories)
- Root directory at top
- Path: /home/user/file.txt
- Example: Unix, Linux, Windows

**DAG (Directed Acyclic Graph)**:
- Files can have multiple parents (hard links)
- More flexible, but complex
- Example: Some Unix systems

**Modern**: Usually tree structure (with hard links creating DAG).

### File Allocation

**Contiguous**:
- File stored in consecutive blocks
- Simple, fast sequential access
- **Problem**: External fragmentation

**Linked**:
- Blocks linked via pointers
- No external fragmentation
- **Problem**: Slow random access (must follow links)

**Indexed**:
- Index block contains pointers to data blocks
- Fast random access
- **Problem**: Large files need multiple index levels
- Example: Linux ext4 (uses inodes with direct/indirect blocks)

### Linux Inode Structure

**Inode** (index node): Metadata about file.

**Contents**:
- File type, permissions
- Owner, group
- Size, timestamps
- **Pointers to data blocks**:
  - 12 direct pointers (small files)
  - 1 single indirect (points to block of pointers)
  - 1 double indirect (points to block of single indirects)
  - 1 triple indirect (points to block of double indirects)

**Example**:
```
Small file (< 12 blocks):
  Inode → Direct blocks [1, 2, 3, ...]

Large file:
  Inode → Direct blocks [1-12]
       → Single indirect → [13-268]
       → Double indirect → [269-...]
```

### Hard Link vs Soft Link

**Hard Link**:
- Multiple directory entries point to **same inode**
- Same file, different names
- Deleting one name doesn't delete file (until last link removed)
- Cannot link directories
- Cannot cross file systems

**Example**:
```bash
ln file.txt hardlink.txt  # Create hard link
# Both point to same inode
# Deleting file.txt doesn't delete data (hardlink.txt still works)
```

**Soft Link (Symbolic Link)**:
- Separate file containing **path to target**
- Points to name, not inode
- Deleting target breaks link (dangling link)
- Can link directories
- Can cross file systems

**Example**:
```bash
ln -s file.txt softlink.txt  # Create soft link
# softlink.txt is separate file containing "file.txt"
# If file.txt deleted, softlink.txt becomes broken
```

**Comparison**:
| Aspect | Hard Link | Soft Link |
|--------|-----------|-----------|
| **Inode** | Same | Different |
| **Target** | Inode | Path (name) |
| **Delete target** | File remains | Link breaks |
| **Directories** | No | Yes |
| **Cross FS** | No | Yes |

### File Permissions

**Linux Permissions** (rwx):
- **Read (r)**: Can read file
- **Write (w)**: Can modify file
- **Execute (x)**: Can run file (programs)

**Three sets** (owner, group, others):
```
-rwxr-xr--  user group file.txt
 │││││││││
 │││││││└─ Others: read
 ││││││└── Others: no write
 │││││└─── Others: no execute
 ││││└──── Group: execute
 │││└───── Group: read
 ││└────── Group: no write
 │└─────── Owner: execute
 └──────── Owner: read, write
```

**Numeric representation**: `755` = rwxr-xr-x

---

## 3. Use Cases

- Storing user data
- Program executables
- Configuration files
- Databases (some use file systems)

---

## 4. Advantages & Disadvantages

**File System Advantages**:
✅ Simple abstraction (files, not blocks)  
✅ Persistent storage  
✅ Access control  
✅ Organization (directories)

**Disadvantages**:
❌ Overhead (metadata, indirection)  
❌ Fragmentation  
❌ Complexity

---

## 5. Best Practices

1. **Understand inodes**: Know how files are stored
2. **Use appropriate allocation**: Depends on access pattern
3. **Handle permissions**: Security important
4. **Avoid fragmentation**: Defragment if needed

---

## 6. Common Pitfalls

⚠️ **Mistake**: Confusing hard links and soft links

⚠️ **Mistake**: Not understanding file descriptors

⚠️ **Mistake**: Ignoring permissions

---

## 7. Interview Tips

**Common Questions**:
1. "What is an inode?"
2. "Compare hard link vs soft link."
3. "How do file descriptors work?"
4. "Explain file allocation methods."

**Key Points**:
- Inode = metadata + pointers to blocks
- Hard link = same inode, Soft link = separate file
- File descriptors = handles to open files
- Allocation: Contiguous, Linked, Indexed

---

## 8. Related Topics

- **Disk & I/O Systems** (Topic 15): How files stored on disk
- **Virtual Memory** (Topic 12): Memory-mapped files

---

## 9. Visual Aids

### File Descriptor Structure

```
Process
  File Descriptor Table
    3 → Open File Table Entry
           │
           ├─ File pointer: 100
           ├─ Mode: read
           └─> Inode
                 ├─ Metadata
                 └─> Data Blocks
```

### Inode Structure

```
Inode
├─ Metadata (size, permissions, etc.)
├─ Direct blocks [1-12]
├─ Single indirect → [13-268]
├─ Double indirect → [269-...]
└─ Triple indirect → [...]
```

---

## 10. Quick Reference Summary

**File**: Named data, abstraction over disk blocks

**Inode**: Metadata + pointers to data blocks

**File Descriptor**: Integer handle to open file

**Hard Link**: Same inode, multiple names

**Soft Link**: Separate file, points to target path

