/*
Language: Liquidsoap
Author: The Savonet Team
Contributors: Romain Beauxis <toots@rastageeks.org>
Description: Liquidsoap is a scripting language for audio streaming
Website: https://www.liquidsoap.info
Category: scripting
*/

export default function(hljs) {
  const IDENT_RE = /[a-zA-Z_][a-zA-Z0-9_']*/;

  const KEYWORDS = {
    $pattern: IDENT_RE,
    keyword: [
      'def', 'let', 'if', 'then', 'else', 'elsif', 'end', 'begin',
      'while', 'do', 'for', 'to', 'fun', 'try', 'catch', 'finally',
      'open', 'rec', 'replaces', 'eval'
    ],
    operator: ['and', 'or', 'not', 'mod'],
    literal: ['true', 'false', 'null']
  };

  const SUBST = {
    scope: 'subst',
    begin: /#\{/,
    end: /\}/,
    keywords: KEYWORDS
  };

  const STRING = {
    scope: 'string',
    variants: [
      {
        begin: /"/,
        end: /"/,
        contains: [
          hljs.BACKSLASH_ESCAPE,
          SUBST
        ]
      },
      {
        begin: /'/,
        end: /'/,
        contains: [
          hljs.BACKSLASH_ESCAPE,
          SUBST
        ]
      }
    ]
  };

  SUBST.contains = [
    STRING,
    hljs.C_NUMBER_MODE
  ];

  const NUMBER = {
    scope: 'number',
    relevance: 0,
    variants: [
      { begin: /\b0[xX][\da-fA-F_]+\b/ },
      { begin: /\b0[oO][0-7_]+\b/ },
      { begin: /\b0[bB][01_]+\b/ },
      { begin: /\b\d[\d_]*\.[\d_]*(?:[eE][-+]?\d[\d_]*)?\b/ },
      { begin: /\b\d[\d_]*[eE][-+]?\d[\d_]*\b/ },
      { begin: /\b\d[\d_]*\b/ }
    ]
  };

  // Nested multiline comments #< ... >#
  const MULTILINE_COMMENT = hljs.COMMENT('#<', '>#', {
    contains: ['self']
  });

  // Single-line comments (must not match #<)
  const LINE_COMMENT = hljs.COMMENT('#(?!<)', '$', {
    relevance: 0,
    contains: [
      {
        scope: 'doctag',
        begin: /@(?:param|return|category|flag|doc)/
      }
    ]
  });

  const ENCODER = {
    scope: 'variable.language',
    begin: /%[a-zA-Z][a-zA-Z0-9_.]*/,
    relevance: 5
  };

  const PREPROCESSOR = {
    scope: 'meta',
    begin: /%(?:ifdef|ifndef|ifencoder|ifnencoder|ifversion|else|endif|include|include_extra)\b/,
    relevance: 10
  };

  const DECORATOR = {
    scope: 'meta',
    begin: /@(?:json\.parse|yaml\.parse|xml\.parse|sqlite\.row|sqlite\.query)/,
    relevance: 10
  };

  const REGEXP = {
    scope: 'regexp',
    begin: /r\//,
    end: /\/[gismu]*/,
    contains: [hljs.BACKSLASH_ESCAPE]
  };

  const TIME_PREDICATE = {
    scope: 'number',
    begin: /\b(?:\d+w)?(?:\d+h)?(?:\d+m)?(?:\d+s)\b/,
    relevance: 0
  };

  const TIME_INTERVAL = {
    scope: 'number',
    begin: /\b(?:\d+w)?(?:\d+h)?(?:\d+m)?(?:\d+s)?-(?:\d+w)?(?:\d+h)?(?:\d+m)?(?:\d+s)\b/,
    relevance: 0
  };

  const VERSION = {
    scope: 'number',
    begin: /\b\d+\.\d+\.\d+\b/,
    relevance: 0
  };

  const LABEL = {
    scope: 'symbol',
    begin: /~[a-zA-Z_][a-zA-Z0-9_']*/
  };

  const METHOD = {
    scope: 'property',
    begin: /(?<=\.)[a-zA-Z_][a-zA-Z0-9_']*/
  };

  const FUNCTION_DEFINITION = {
    beginKeywords: 'def',
    end: /(?==|\(|$)/,
    contains: [
      {
        scope: 'title.function',
        begin: IDENT_RE,
        relevance: 0
      }
    ]
  };

  const FUNCTION_CALL = {
    scope: 'title.function.invoke',
    begin: hljs.regex.concat(IDENT_RE, /(?=\s*\()/),
    relevance: 0
  };

  const TYPE = {
    scope: 'type',
    begin: /\b(?:int|float|bool|string|list|source|request|file|unit)\b/,
    relevance: 0
  };

  const OPERATOR = {
    scope: 'operator',
    begin: /::|\?\?|\?\.|\.\{|:=|->|!(?!=)/,
    relevance: 0
  };

  return {
    name: 'Liquidsoap',
    aliases: ['liq'],
    keywords: KEYWORDS,
    contains: [
      MULTILINE_COMMENT,
      LINE_COMMENT,
      STRING,
      NUMBER,
      ENCODER,
      PREPROCESSOR,
      DECORATOR,
      REGEXP,
      TIME_INTERVAL,
      TIME_PREDICATE,
      VERSION,
      LABEL,
      METHOD,
      FUNCTION_DEFINITION,
      FUNCTION_CALL,
      TYPE,
      OPERATOR
    ]
  };
}
