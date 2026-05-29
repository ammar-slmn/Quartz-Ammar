---
title: Chapter 3 - Data Models and Query Languages
tags:
  - study-notes
description: My notes on Chapter 3 of Designing Data-Intensive Applications, 2nd Edition.
---
Data models might be the most important part of developing software as they have a profound effect on how software is written. Software is built upon layers and layers of different data models all the way down to the hardware level where bytes are represented as electrical currents, pulses and magnetic fields etc. 

Some data is easier to express and query in one model but tougher in another. Many of the query languages discussed in this chapter are ***declarative***, meaning which means that you specify the pattern of the data you want, what conditions the results must meet and how you want the data to be transformed, but not how to achieve that goal. The DB's query optimiser decides which indexes and joins to use and in which order to execute the different parts of the query. This contrasts with most programming languages where you write an algorithm explicitly instructing thew computer of which operations to perform in which order.

**Example:** A DB can execute a query in parallel across multiple CPU cores and machines, without us having to implement this parallel execution ourselves. 
## Relational VS Document Models
In the relational model, data is organised into relations (called tables in SQL), where each relation is an unordered collection of tuples. Many competitors came and went, but the relational model is the industry go-to choice. SQL has grown to incorporate other types of data now, such as XML, JSON and graph data. 

**NoSQL** refers to a set of ideas around new data models, schema flexibility, scalability and open source licensing models. One effect of this is the document model, which represents data as JSON (*MongoDB, Couchbase*) but relational databases have also added in JSON support as mentioned. 
### The Object-Relational Mismatch 
Most development is now done in OOP languages, which requires an awkward translation layer between the objects and the database model. This disconnect is sometimes referred to as an ***impedance mismatch***.  
*Note - The term impedance mismatch is borrowed from electronics.* 
#### Object-Relational Mapping 
ORM frameworks provide solutions for this translation layer but are often criticised: 
- Are complex; can't completely hide the differences between the 2 models and engineers still have to think about both object and relational representations. 
- Generally used only for OLTP app development; data engineers need to work with the relational representation so the design of the schema still matters. 
- Some ORMs auto generate schemas, but these are usually awkward and inefficient for the underlying database. Customising the generated schema can be complex and makes the ORMs benefit useless. 
- ORMs make it easy to write inefficient queries. **Example:** N + 1 query problem. 

**Some advantages include:** 
- Can reduce boilerplate; still useful for simple and repetitive cases. 
- Some ORMs help with caching the results of database queries, reducing load on DB. 
- Can help manage schema migrations and other administrative activities. 
#### The Document Data Model for One-To-Many Relationships 
An example of the limitation of the relational model would be representing a LinkedIn profile. Most people have more than one job in their career along with many other fields, and one way of representing one-to-many relationships like this is to put positions, education and contact information in separate tables, each with a foreign key reference to the users table. If you want to fetch a query in the relational model, you need to write multiple queries or perform a messy join. 

A more efficient approach would be with JSON similar to: 

```JSON
{
  "user_id":     251,
  "first_name":  "Muhammad Ammar",
  "last_name":   "Salman",
  "headline":    "Incoming SWE @ _______",
  "region_id":   "uk:1",
  "photo_url":   "/p/7/000/253/05b/308dd6e.jpg",
  "positions": [
    {"job_title": "Software Engineer Intern", "organization": "HubSpot"},
    {"job_title": "Software Engineer", "organization": "GWC Logistics"},
    {"job_title": "Software Engineer Intern", "organization": "GWC Logistics"}
  ],
  "education": [
    {"school_name": "University of _______",  "start": 2023, "end": 2026},
  ],
  "contact_info": {
    "email": "ammar________@gmail.com",
  }
}
```

### Normalisation, Denormalization and Joins 
In the previous example, both region and user are stored as IDs as there are advantages to having standardized lists of geographic regions and letting users choose from a drop-down list or auto completer. **Advantages include:** 
 - Consistent spelling/styling 
 - Avoid ambiguity 
 - Ease of Update 
 - Translation is simpler when translating standardised lists 
 - Better search functionality 

When you use an ID, your data is more normalised. When you store the text directly, duplicating meaningful information for every record, the data is denormalization. An ID has no meaning to users, and even if the data changes - the ID can remain the same. With duplication, all redundant copies will need to be updated which would require more code, more writes and more disk space while risking inconsistencies. 

The downside of normalised representation is that an additional lookup is required to resolve the ID into human readable data: 

```SQL
SELECT users.*, regions.region_name
FROM users
JOIN regions ON users.region_id = regions.id
WHERE users.id = 251;
```

Document databases are both normalised & denormalized but are more associated with denormalization as the JSON model makes it easy to store those fields. Weak support for joins in many document databases also makes such normalisation inconvenient (some don't even support joins). 
#### Trade-offs of Normalisation 
**Normalised Data:**
- Faster to write (since there is only one copy)
- Slower to query (since it requires joins) 
- Better for OLTP systems where both reads and writes need to be quick 
- Cost of joins can become problematic in large-scale systems 

**Denormalized Data:** 
- Faster to read (fewer joins) 
- More expensive to write (more copies to update, more disk space used) 
- Better for analytical systems as they perform updates in bulk 
### Many-to-One and Many-to-Many Relationships
The region_id field is an example of a many-to-one relationship as many people live in the same region, but we assume that each person lives in only one region at any one time. Introducing entities for organisations and schools would lead to many-to-many relationships as one person may have worked for several organisations and an organisation has several employees (past or present). In a relational model, such a relationship is usually represented as an ***associative table***, or ***join table***. 

Many-to-many relationships often need to be queried in both directions and one way of enabling this is storing ID references on both sides. This representation is denormalized, since the relationship is stored in two places, which could become inconsistent with each other. A normalised version stores this relationship in one place and relies on ***secondary indexes*** to solve this problem. 
### Stars and Snowflakes: Schemas for Analytics 
**Data warehouses are usually relational** and these are the widely used conventions for the structure of tables in a warehouse: 
- Star schema
- Snowflake schema
- Dimensional modelling 
- One big table (OBT) 
### When to Use Which Model 
**The main arguments for the document model are:** schema flexibility, better performance due to locality, and that some apps are closer to the object model used by the application. **Relational models can lead to** cumbersome schemas and unnecessarily complicated code. 

**Document Model Limitations:** Cannot refer directly to a nested item within a document; instead, you need to say something like, “the second item in the list of positions for user 251.” If you need to reference nested items, a relational approach works better, since you can refer to any item directly by its ID.

The document mode supports ordered drop down lists much better as items can be stored in a JSON array. There isn't a standard way of doing so in reorderable lists and tricks such as sorting by an integer column, maintaining a linked list of IDs or using fractional indexing. 
#### Schema Flexibility in the Document Model 
Stopped here for today blud 