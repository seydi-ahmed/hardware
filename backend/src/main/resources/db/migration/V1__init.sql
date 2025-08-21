create table users (
  id bigserial primary key,
  email varchar(255) unique not null,
  password varchar(255) not null,
  full_name varchar(255) not null,
  created_at timestamp not null default now()
);

create table stores (
  id bigserial primary key,
  name varchar(255) not null,
  address text,
  owner_id bigint not null references users(id) on delete cascade,
  created_at timestamp not null default now()
);

create table products (
  id bigserial primary key,
  name varchar(255) not null,
  sku varchar(100),
  price numeric(12,2) not null default 0,
  stock integer not null default 0,
  store_id bigint not null references stores(id) on delete cascade,
  created_at timestamp not null default now()
);

create index idx_products_store on products(store_id);
create index idx_stores_owner on stores(owner_id);
