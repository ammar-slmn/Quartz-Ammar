---
title: Chapter 1 - Trade-Offs in Data Systems Architecture
tags:
  - study-notes
description: My personal notes on Chapter 1 of Designing Data-Intensive Applications, 2nd Edition.
---
**TLDR -** The theme behind this chapter has been to understand trade-offs, many questions do not have one right answer. 

Very basic notes on the first chapter which **covering 4 basic topics:** 
1. Operational Versus Analytical Systems
2. Cloud Versus Self-Hosting 
3. Distributed Versus Single-Node Systems
4. Data Systems, Law and Society 

**There are no notes on Topic 1 or 4 as I read them separately before I started writing :). The chapter itself is not technical in content, but rather sets up basic concepts and definitions for the rest of the book. 
## Cloud Versus Self-Hosting

Should you build or buy? Things that are a competitive advantage to the org should be done in house, while routine work should be left to a vendor (like a CPU, not everybody is a semiconductor manufacturer). 

**Spectrum:** At one extreme is bespoke software that you write and run in-house; at the other extreme are widely products/services that are implemented and operated by an external vendor. The middle ground is an off-the-shelf software that you can *self-host* in a variety of ways. 

How do you deploy the services though? On premises? Cloud? 
### Pros and Cons of Cloud Services: 

Saves time, money and allows for faster iteration compared to setting up your infrastructure, but if you already have experience setting up and operating the infra and the load is manageable - then you can buy your own machines and run the software on them yourself. 

A newer domain can be tricky though, adopting a cloud service is easier and can be quick to learn. You can hire a team to operate that system but the basic system administration can be outsourced to the provider, while you can focus on higher level concerns.

The provider will specialise in in running that service, resulting in a better experience. A pre-built service may not be as customisable as your own service. 

Cloud services make it easier to scale computing resources up or down in response to changes in load. Running an analytical query requires a lot of compute in parallel and you can smooth out the load by using the cloud can save money, since you can return unused resources to the provider rather than leaving rather than leaving them idle. 

**Downsides:** 
- Cannot implement custom features. 
- No control over reliability.  
- If the system triggers a bug or causes performance problems, diagnosing the issue will be difficult. You do not have access to their logs or internals. 
- You are at the vendor's mercy. If they shut down or increase prices, you must migrate to an alternative services. 

Due to all of these risks, companies build new applications on top of cloud services or adopt a hybrid approach in which cloud services are used for some aspects of the systems while in-house systems remain necessary, especially for sensitive applications that full control of the system. 
### Cloud Native System Architecture  

**Cloud Native:** An architecture that is designed to take advantage of cloud services.

**Advantages:** 
1. Better performance on same hardware.
2. Faster recovery from failures.
3. Ability to quickly scale computing resources to match incoming load. 
4. Support larger datasets. 
#### Layering of Cloud Services  

**Basic self-hosted data systems:** Run on basic OS (Linux, Windows), store data as files on the filesystem, communicate via standard protocols (TCP/IP). Some systems depend on special hardware (GPUs for ML, RDMA for network interfaces). 

**Cloud:** Can run as an IaaS environment (with one of more VMs or instances) with allocations of CPUs, memory, disk and network bandwidth. Cloud machines can be provisioned faster, come in a variety of sizes but are overall smaller than traditional computers. 

**Object storage services** (Amazon S3, Azure Blob Storage and Cloudflare R2) provide limited APIs compared to filesystem, but automatically distributing data across many machines to increase space and improve reliability.  Snowflake (cloud-based analytical database / data warehouse) in turn is built on top of Amazon S3 and other services are built on top of Snowflake. 

Higher Level Abstraction -> Oriented Towards Particular Use Case. 

#### Separation of Storage and Compute 
Disk storage is durable. Usually assume that once something is written to disk, it will not be lost. 

**RAID (redundant array of independent disks)**: Used to maintain copies of data on several disks attached to the same machine to tolerate the failure of an individual hard disk. Can be implemented in either hardware or software by the OS. 

Compute instances (VMs) also have disks attached, but cloud native systems typically treat these disks more like an ephemeral cache and not like long-term storage. Why? -> Local disk becomes inaccessible if the associated instance fails or if the instance is replaced with a bigger or smaller one. 

**Alternate to Local Disks:** Virtual disk storage that can be detached from one instance and attached to a different one. Not a physical disk, but a cloud service provided by a set of machines that simulate the behaviour of a disk (*a block device*). This makes it possible to run disk-based software in the cloud. This does make the system sensitive to network glitches, since every I/O operation is a network call. 

How to avoid this? Build on dedicated storage services that are optimised for certain workloads. Object stores (S3, Blob Storage) -> Designed for long-term storage on large files. 

In a traditional systems architecture, the same computer is responsible for both storage (disk) and computation (CPU and RAM) but in cloud native systems, these responsibilities have become somewhat separated (S3 only stores files, have to write code elsewhere to analyse them). 

**Multitenant:** Instead of having a separate machine for each customer, data and computation for several customers are handled on the same shared hardware by the same service. 

**Allows for:** 
- Better hardware utilisation.
- Easier scalability.
- Easier management by the cloud provider, but also requires careful engineering. 

### Operations in the Cloud Era

**Database Administrator or Sysadmin**: Staff who manage the org's server-side data infrastructure. 
More recently, companies have integrated roles of development and operations into teams with a shared responsibility for both backend services and data infrastructure (DevOps or SRE).

For self-hosted systems, operations involve work at the level of individual machines (capacity planning, provisioning new machines and moving services across them). Cloud services provide an API that hides the complexity (**metered billing** to store data without planning needs in advance).

**SRE/DevOps Philosophy:** 
- Automations, repeatable processes over manual one-off jobs. 
- Use temp VMs and services rather than long-running servers
- Enable frequent application updates
- Learn from Incidents 
- Document and preserve system knowledge for the system 

**Customers still need to involved in operations:** 
- Capacity Planning -> Financial Planning 
- Performance Optimisation -> Cost Optimisation 
- Cloud Services have quotas and while they can be easier and quicker than provisioning and running your own infra, you have to learn abut them. 
- Security cannot be outsourced to services, neither can monitoring the load on them or managing interfaces between your services. 

## Distributed Versus Single-Node Systems 

**Distributed Systems:** A system that involves several machines communicating via a network. Each machine/process is called a **node**. 

If an app has two or more users or if data is stored in one services but processed in another, the system is unavoidably distributed as communication will occur over a network. If one node goes down, you can use multiple machines to increase reliability (Fault Tolerance). Other Reasons to implement include: Scalability, Latency (each user can be served from a near-by server), Elasticity, Specialised Hardware, Legal Compliance and Sustainability. 

### Problems with Distributed Systems 

**Downsides:** 
1. Requests deal with the possibility of failure (network interruptions, service crashes) and hence no response will be received. Retrying is not always safe. 
2. Making a call to another service is much slower than calling a function on the same node. Its faster to bring computation to the machine that has the data rather than transferring data. More nodes != faster. 
3. Tough to debug and troubleshoot a distributed system. Requires observability. Tools like OpenTelemetry, Zipkin and Jaeger allow you to track which client called which server for each operation and how long each call took. 
4. Maintaining consistency across different services becomes the app's problem when each service has its own DB. 

For all these reasons, performing a task on a single machine is much simpler and cheaper than setting up a distributed system. 
### Microservices and Serverless 
Way of building apps was traditionally called a ***service-oriented architecture*** and has been refined into a ***microservices architecture***.  Each service has **one** well defined purpose and exposes an API that can be called by clients via the network. Thus, a complex app can be decomposed into multiple services. 

**Advantages:**
- Each service can be updated independently
- Reduced coordination between teams
- Service has its own hardware resources
- Service owners are free to change implementation without affecting clients
- Do not usually share DBs, which avoids a negative impact on queries

**Disadvantages:** 
- Breeds complexity
- Testing can be complicated 
- Each service requires infrastructure to deploy new releases
- Challenging to change API fields since clients expect certain fields

**Microservices are primarily a technical solution to a people problem:** Allowing teams to make progress independently without having to coordinate with each other. Good in a large company, unnecessary overhead in a smaller one.

**Serverless:** Another approach to deploying services in which management of the infrastructure is outsourced to a cloud vendor. In serverless, the provider automatically allocates and frees hardware resources as needed based on incoming requests. **Brings metered billing to code execution**. Providers impose a time limit on function execution and limited runtime environments. Services can suffer from slow start times when a function is invoked. **Still runs on a server, name is misleading!!** 
### Cloud Computing Versus Supercomputing 

An alternative to cloud computing is ***high performance computing (HPC)***. There are overlaps, but HPC has different priorities and uses different techniques. **Main Differences:** 
- Supercomputers are used for computationally intensive scientific tasks (climate modeling, complex optimisation problems and solving partial differential equations). 
- Supercomputers run large batch jobs that store the state of their computation to disk from time to time. If a node fails, you can stop the entire cluster workload, repair the node and then restart computation. 
- Nodes communicate through shared memory and RDMA, which support high bandwidth and low latency but assume a high level of trust. 
- Supercomputers use specialised network topologies, such as multidimensional meshes.
- Supercomputers assume nodes are close together.
