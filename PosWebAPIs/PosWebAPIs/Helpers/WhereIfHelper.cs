﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace PHubApi.Helpers
{
    public static class WhereIfHelper
    {
        public static IQueryable<TSource> WhereIf<TSource>(
              this IQueryable<TSource> source,
              bool condition,
              Expression<Func<TSource, bool>> predicate)
        {
            if (condition)
                return source.Where(predicate);
            else
                return source;
        }
    }
}
