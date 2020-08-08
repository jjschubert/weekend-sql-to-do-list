CREATE TABLE items(
	"id" SERIAL PRIMARY KEY,
	"task" VARCHAR (250) NOT NULL,
	"goal" VARCHAR (100) NOT NULL,
	"completion" VARCHAR (20),
  "status" VARCHAR (80) DEFAULT 'Not done'
);
