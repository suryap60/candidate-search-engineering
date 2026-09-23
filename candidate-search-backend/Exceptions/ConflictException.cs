using System;

namespace CandidateSearch.Api.Exceptions;

public class ConflictException : Exception
{
    public ConflictException(string message)
        : base(message)
    {
    }
}