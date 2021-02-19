# Search Indexer Migration

The code inside the migration folder is built into a single file which is run
on `initContainer` inside the cluster. The migration file has several tasks:

- Keep the dictionaries inside AWS up to date with `elasticsearch-dictionaries`
  - Manage files inside S3 buckets
  - Create packages inside AWS ES
  - Associate and disassociate packages with AWS ES domains
- Keep ES indexes up to date
  - Create new index versions
  - Migrate data from datasources
  - Manage aliases
  - Rollback to last deployed version on failure

You can run the migration script locally to manage your `dev-service` instance
of elasticsearch. **The migrate script assumes you have dictionary files inside
elasticsearch config and hence is unlikely to work with standard instances of
elasticsearch**

### Quick start

#### Migrate

You can run the migration with

```bash
yarn nx run services-search-indexer:migrate
```

This migrates the ES indexes to the latest version defined by the
`content-search-index-manager` library. It also imports all kibana saved
objects that are in `./config/kibana` folder.

#### Sync Kibana

You can run a kibana sync with

```bash
yarn nx run services-search-indexer:migrate --sync-kibana
```

A sync fetches saved objects from a local running kibana instance and updates
your local kibana files. It uses the ids of the objects inside the
`./config/kibana` folder and searches for them on your instance and updates
them accordingly. Remember to run `migrate` before running `sync-kibana`.
