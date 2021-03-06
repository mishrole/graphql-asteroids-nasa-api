import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { createServer } from '@graphql-yoga/node';
import fetch from 'node-fetch';

dotenv.config();

const API_NASA_NEO = 'https://api.nasa.gov/neo/rest/v1/feed';
const API_KEY = process.env.API_KEY;

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
    authors: [Author],
    asteroids: Asteroids,
  },
  type Author {
    name: String!
    id: String!
  },
  type Mutation {
    addAuthor(name: String): Author
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
  type Today {
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
  },
  type NearEarthObject {
    today: [Today]
  },
  type Asteroids {
    element_count: Int
    near_earth_objects: NearEarthObject
    links: Links
  },
`;

const RESOLVERS = {
  Query: {
    authors: () => {
      return ALL_AUTHORS
    },
    asteroids: async () => {
      const START_DATE = '2022-05-24';
      const END_DATE = '2022-05-24';
      let response = await fetch(`${API_NASA_NEO}?start_date=${START_DATE}&end_date=${END_DATE}&api_key=${API_KEY}`);
      let data = await response.text();
      data = data.replaceAll(START_DATE, 'today');
      return JSON.parse(data);
    }
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

{
  asteroids {
    element_count,
    near_earth_objects {
      today {
        id
        name
    		nasa_jpl_url
        is_potentially_hazardous_asteroid
        close_approach_data {
          close_approach_date
          close_approach_date_full
          epoch_date_close_approach
          orbiting_body
        }
        estimated_diameter {
          meters {
            estimated_diameter_min
            estimated_diameter_max
          }
        }
      }
    }
  }
}

*/