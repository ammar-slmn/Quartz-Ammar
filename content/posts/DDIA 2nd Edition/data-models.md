---
title: Chapter 3 - Data Models and Query Languages
tags:
  - study-notes
description: My notes on Chapter 3 of Designing Data-Intensive Applications, 2nd Edition.
---
Data models might be the most important part of developing software as they have a profound effect on how software is written. Software is built upon layers and layers of different data models all the way down to the hardware level where bytes are represented as electrical currents, pulses and magnetic fields etc. 

Some data is easier to express and query in one model but tougher in another. Many of the query languages discussed in this chapter are ***declarative***, meaning which means that you specify the pattern of the data you want, what conditions the results must meet and how you want the data to be transformed, but not _how_ to achieve that goal. The DB's query optimiser decides which indexes and joins to use and in which order to execute the different parts of the query. This contrasts with most programming languages where you write an algorithm explicitly instructing thew computer of which operations to perform in which order.

**Example:** A DB can execute a query in parallel across multiple CPU cores and machines, without us having to implement this parallel execution ourselves. 

## Relational VS Document Models

In the relational model, data is organised into relations (called tables in SQL), where each relation is an unordered collection of tuples. Many competitors came and went, but the relational model is the industry go-to choice. SQL has grown to incorporate other types of data now, such as XML, JSON and graph data. 

**NoSQL** refers to a set of ideas around new data models, schema flexibility, scalability and open source licensing models. One effect of this is the document model, which represents data as JSON (*MongoDB, Couchbase*) but relational databases have also added in JSON support as mentioned. 

### The Object-Relational Mismatch 
Most development is now done in OOP languages, which requires an awkward translation layer between the objects and the database model. This disconnect is sometimes referred to as an ***impedance mismatch***.  

*Note - The term impedance mismatch is borrowed from electronics.* 
#### Object-Relational Mapping 

ORM frameworks provide solutions for this translation layer but are often criticised: 

**Cons:** 
- Are complex; can't completely hide the differences between the 2 models and engineers still have to think about both object and relational representations. 
- Generally used only for OLTP app development; data engineers need to work with the relational representation so the design of the schema still matters. 
- Some ORMs auto generate schemas, but these are usually awkward and inefficient for the underlying database. Customising the generated schema can be complex and makes the ORMs benefit useless. 
- ORMs make it easy to write inefficient queries. **Example:** N + 1 query problem. 

**Pros:** 
- Can reduce boilerplate; still useful for simple and repetitive cases. 
- Some ORMs help with caching the results of database queries, reducing load on DB. 
- Can help manage schema migrations and other administrative activities. 
#### The Document Data Model for One-To-Many Relationships 
