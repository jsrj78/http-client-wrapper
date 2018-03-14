### HttpClient and HttpClientCRUD ##

`HttpClentBase` - Wrapper around `HttpClient`'s `get`, `post`, `put` and `delete` methods

`HttpClientCRUD<Id, T>` - Generic class which extends `HttpClientBase` and implements CRUD operations
  * `Id` - Model's primary key `Type`
  * `T` - Model's `Type`
