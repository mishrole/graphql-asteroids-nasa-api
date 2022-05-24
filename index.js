import { v4 as uuidv4 } from 'uuid';
import { createServer } from '@graphql-yoga/node';

const ALL_AUTHORS = [
  {
    'name': 'Robert Martin',
    'id': 'afa51ab0-344d-11e9-a414-719c6709cf3e',
  },
  {
    'name': 'Martin Fowler',
    'id': 'afa5b6f0-344d-11e9-a414-719c6709cf3e',
  },
  {
    'name': 'Fyodor Dostoevsky',
    'id': 'afa5b6f1-344d-11e9-a414-719c6709cf3e',
  },
  {
    'name': 'Joshua Kerievsky',
    'id': 'afa5b6f2-344d-11e9-a414-719c6709cf3e',
  },
  {
    'name': 'Sandi Metz',
    'id': 'afa5b6f3-344d-11e9-a414-719c6709cf3e',
  }
]

const TYPE_DEFS = `
  type Query {
    authors: [Author]
  },
  type Author {
    name: String!
    id: String!
  },
  type Mutation {
    addAuthor(name: String): Author
  },
  type Asteroids {
    element_count: Int
    near_earth_objects: [NearEarthObject]
    links: Links
  },
  type Links {
    next: String
    prev: String
    self: String
  },
  type Diameter {
    estimated_diameter_min: Float
    estimated_diameter_max: Float
  },
  type EstimatedDiameter {
    kilometers: Diameter
    meters: Diameter
    miles: Diameter
    feet: Diameter
  },
  type RelativeVelocity {
    kilometers_per_second: Float
    kilometers_per_hour: Float
    miles_per_hour: Float
  },
  type MissDistance {
    astronomical: Float
    lunar: Float
    kilometers: Float
    miles: Float
  },
  type CloseApproachData {
    close_approach_date: String
    close_approach_date_full: String
    epoch_date_close_approach: Float
    relative_velocity: RelativeVelocity
    miss_distance: MissDistance
    orbiting_body: String
  },
  type NearEarthObject {
    links: Links
    id: String
    neo_reference_id: String
    name: String
    nasa_jpl_url: String
    absolute_magnitude_h: Float
    estimated_diameter: EstimatedDiameter
    is_potentially_hazardous_asteroid: Boolean
    close_approach_data: [CloseApproachData]
    is_sentry_object: Boolean
  }
`;

const RESOLVERS = {
  Query: {
    authors: () => {
      return ALL_AUTHORS
    },
  },
  Mutation: {
    addAuthor: (_, data) => {
      const NEW_AUTHOR = {
        name: data.name,
        id: uuidv4()
      }
      ALL_AUTHORS.push(NEW_AUTHOR)
      return NEW_AUTHOR
    }
  }
};

// Provide your schema here
const SERVER = createServer({
  schema: {
    typeDefs: TYPE_DEFS,
    resolvers: RESOLVERS,
  },
});

// Start the server and explore your GraphQL API http://localhost:4000/graphql
SERVER.start();


/*
** Call Mutations
mutation {
  addAuthor(name:"Mitchell") {
    id name
  }
}
m 
** Call Query
{
  authors {
    id name
  }
}

*/