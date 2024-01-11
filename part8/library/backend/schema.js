const typeDefs = `
  type Author {
    name: String!
    born: Int
    id: ID!
    bookCount: Int
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }
  type Subscription {
    bookAdded: Book!
   }  
  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
    editAuthor(id: String! born: Int!) : Author
  }

  type Query {
    bookCount: Int
    authorCount: Int
    allBooks(author: String, genre: String, genres: [String]): [Book!]!
    allAuthors: [Author!]!
    me: User
  }
`;

module.exports = typeDefs;
