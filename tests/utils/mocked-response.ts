import * as dream from 'dreamjs';

export default () => dream
  .schema({
    id: Number,
    field1: String,
    field2: Number,
    field3: Date,
    hasOneToMany: {
      id: Number,
      field1: String,
      field2: Number,
      field3: Date,
    },
    hasOneToOne: {
      id: Number,
      field1: String,
      field2: Number,
      field3: Date,
    },
    hasManyToMany: [
      {
        id: Number,
        field1: String,
        field2: Number,
        field3: Date,
      },
      {
        id: Number,
        field1: String,
        field2: Number,
        field3: Date,
      },
      {
        id: Number,
        field1: String,
        field2: Number,
        field3: Date,
      },
    ],
    hasManyToOne: [
      {
        id: Number,
        field1: String,
        field2: Number,
        field3: Date,
      },
      {
        id: Number,
        field1: String,
        field2: Number,
        field3: Date,
      },
      {
        id: Number,
        field1: String,
        field2: Number,
        field3: Date,
      },
    ],
  }).generateRnd(10).output();
