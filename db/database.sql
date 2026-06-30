CREATE TABLE person(
    id SERIAL PRIMARY KEY,
    fio VARCHAR(255),
    job_title VARCHAR(255),
    pass VARCHAR(255),
    laboratory INTEGER,
    department INTEGER,
    management INTEGER
);

CREATE TABLE works(
    id SERIAL PRIMARY KEY,
    content VARCHAR(255),
    subcontent VARCHAR(1000),
    person_id INTEGER,
    FOREIGN KEY (person_id) REFERENCES person(id)
);