---
title: API Systemu Rekrutacyjnego v1.0.0
language_tabs:
  - bash: cURL
  - javascript: Node.js
toc_footers: []
includes: []
search: true
highlight_theme: darkula
headingLevel: 2

---

<!-- Generator: Widdershins v4.0.1 -->

<h1 id="api-systemu-rekrutacyjnego">API Systemu Rekrutacyjnego v1.0.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

Dokumentacja backendu.

<h1 id="api-systemu-rekrutacyjnego-jobs">Jobs</h1>

## get__api_jobs

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/api/jobs',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/jobs`

*Pobiera listę wszystkich ofert pracy*

Pobiera wszystkie aktywne oferty pracy z bazy danych wraz z dołączoną nazwą firmy (JOIN).

> Example responses

> 200 Response

```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "id": {
        "type": "integer"
      },
      "title": {
        "type": "string",
        "example": "Senior Frontend Developer"
      },
      "description": {
        "type": "string"
      },
      "salary_range": {
        "type": "string",
        "example": "15000 - 20000 PLN"
      },
      "company_id": {
        "type": "integer"
      },
      "company_name": {
        "type": "string",
        "example": "TechCorp"
      },
      "created_at": {
        "type": "string",
        "format": "date-time"
      }
    }
  }
}
```

<h3 id="get__api_jobs-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Lista ofert pracy|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Wewnętrzny błąd serwera.|None|

<h3 id="get__api_jobs-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» id|integer|false|none|none|
|» title|string|false|none|none|
|» description|string|false|none|none|
|» salary_range|string|false|none|none|
|» company_id|integer|false|none|none|
|» company_name|string|false|none|none|
|» created_at|string(date-time)|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_jobs

> Code samples

```javascript
const inputBody = '{
  "type": "object",
  "required": [
    "title",
    "description",
    "company_id"
  ],
  "properties": {
    "title": {
      "type": "string",
      "description": "Nazwa stanowiska"
    },
    "description": {
      "type": "string",
      "description": "Pełny opis oferty"
    },
    "salary_range": {
      "type": "string",
      "description": "Widełki płacowe"
    },
    "company_id": {
      "type": "integer",
      "description": "ID firmy wystawiającej ofertę"
    }
  }
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/api/jobs',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/jobs`

*Dodaje nową ofertę pracy*

Wymaga bycia zalogowanym (Admin/Rekruter). Operacja jest zapisywana w logu audytowym.

> Body parameter

```json
{
  "type": "object",
  "required": [
    "title",
    "description",
    "company_id"
  ],
  "properties": {
    "title": {
      "type": "string",
      "description": "Nazwa stanowiska"
    },
    "description": {
      "type": "string",
      "description": "Pełny opis oferty"
    },
    "salary_range": {
      "type": "string",
      "description": "Widełki płacowe"
    },
    "company_id": {
      "type": "integer",
      "description": "ID firmy wystawiającej ofertę"
    }
  }
}
```

<h3 id="post__api_jobs-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» title|body|string|true|Nazwa stanowiska|
|» description|body|string|true|Pełny opis oferty|
|» salary_range|body|string|false|Widełki płacowe|
|» company_id|body|integer|true|ID firmy wystawiającej ofertę|

<h3 id="post__api_jobs-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Oferta dodana pomyślnie.|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Brak dostępu (niezalogowany).|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Błąd wewnętrzny.|None|

<aside class="success">
This operation does not require authentication
</aside>

## get__api_jobs_{id}

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/api/jobs/{id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/jobs/{id}`

*Pobiera szczegóły pojedynczej oferty pracy*

<h3 id="get__api_jobs_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer|true|ID oferty pracy|

> Example responses

> 200 Response

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "integer"
    },
    "title": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "salary_range": {
      "type": "string"
    },
    "company_id": {
      "type": "integer"
    },
    "company_name": {
      "type": "string"
    }
  }
}
```

<h3 id="get__api_jobs_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Szczegóły oferty pracy|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Nie znaleziono oferty.|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Wewnętrzny błąd serwera.|None|

<h3 id="get__api_jobs_{id}-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» id|integer|false|none|none|
|» title|string|false|none|none|
|» description|string|false|none|none|
|» salary_range|string|false|none|none|
|» company_id|integer|false|none|none|
|» company_name|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## put__api_jobs_{id}

> Code samples

```javascript
const inputBody = '{
  "type": "object",
  "properties": {
    "title": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "location": {
      "type": "string"
    },
    "salary_range": {
      "type": "string"
    },
    "company_id": {
      "type": "integer"
    }
  }
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/api/jobs/{id}',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PUT /api/jobs/{id}`

*Modyfikuje istniejącą ofertę pracy*

Aktualizuje szczegóły oferty (tytuł, opis, pensja, przypisana firma). Rejestruje dokładne zmiany w tabeli audytu. Wymaga autoryzacji.

> Body parameter

```json
{
  "type": "object",
  "properties": {
    "title": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "location": {
      "type": "string"
    },
    "salary_range": {
      "type": "string"
    },
    "company_id": {
      "type": "integer"
    }
  }
}
```

<h3 id="put__api_jobs_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer|true|ID oferty do edycji|
|body|body|object|true|none|
|» title|body|string|false|none|
|» description|body|string|false|none|
|» location|body|string|false|none|
|» salary_range|body|string|false|none|
|» company_id|body|integer|false|none|

<h3 id="put__api_jobs_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Oferta zaktualizowana pomyślnie (lub brak zmian do zapisania).|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Brak dostępu.|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Nie znaleziono oferty.|None|

<aside class="success">
This operation does not require authentication
</aside>

## delete__api_jobs_{id}

> Code samples

```javascript

fetch('/api/jobs/{id}',
{
  method: 'DELETE'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /api/jobs/{id}`

*Usuwa ofertę pracy*

<h3 id="delete__api_jobs_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer|true|ID oferty do usunięcia|

<h3 id="delete__api_jobs_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Oferta usunięta pomyślnie.|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Brak dostępu (użytkownik niezalogowany).|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Nie znaleziono oferty o podanym ID.|None|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="api-systemu-rekrutacyjnego-companies">Companies</h1>

## get__api_companies

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/api/companies',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/companies`

*Pobiera listę wszystkich firm*

Zwraca tablicę obiektów reprezentujących firmy w systemie.

> Example responses

> 200 Response

```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "id": {
        "type": "integer",
        "example": 1
      },
      "name": {
        "type": "string",
        "example": "TechCorp"
      },
      "location": {
        "type": "string",
        "example": "Warszawa"
      },
      "logo_url": {
        "type": "string",
        "example": "/uploads/logos/logo-123.png"
      }
    }
  }
}
```

<h3 id="get__api_companies-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Sukces. Lista firm.|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Błąd pobierania firm z bazy danych.|None|

<h3 id="get__api_companies-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» id|integer|false|none|none|
|» name|string|false|none|none|
|» location|string|false|none|none|
|» logo_url|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_companies

> Code samples

```javascript
const inputBody = '{
  "type": "object",
  "required": [
    "name"
  ],
  "properties": {
    "name": {
      "type": "string",
      "description": "Nazwa firmy"
    },
    "location": {
      "type": "string",
      "description": "Lokalizacja / miasto"
    },
    "logo_url": {
      "type": "string",
      "description": "Ścieżka do wgranego wcześniej pliku z logo"
    }
  }
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/api/companies',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/companies`

*Dodaje nową firmę do bazy*

Tworzy nowy rekord firmy. Akcja jest logowana w systemie audytu.

> Body parameter

```json
{
  "type": "object",
  "required": [
    "name"
  ],
  "properties": {
    "name": {
      "type": "string",
      "description": "Nazwa firmy"
    },
    "location": {
      "type": "string",
      "description": "Lokalizacja / miasto"
    },
    "logo_url": {
      "type": "string",
      "description": "Ścieżka do wgranego wcześniej pliku z logo"
    }
  }
}
```

<h3 id="post__api_companies-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» name|body|string|true|Nazwa firmy|
|» location|body|string|false|Lokalizacja / miasto|
|» logo_url|body|string|false|Ścieżka do wgranego wcześniej pliku z logo|

> Example responses

> 200 Response

```json
{
  "type": "object",
  "properties": {
    "success": {
      "type": "boolean"
    },
    "message": {
      "type": "string"
    }
  }
}
```

<h3 id="post__api_companies-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Firma dodana pomyślnie.|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Brak dostępu (użytkownik niezalogowany).|None|

<h3 id="post__api_companies-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» message|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## put__api_companies_{id}

> Code samples

```javascript
const inputBody = '{
  "type": "object",
  "required": [
    "name"
  ],
  "properties": {
    "name": {
      "type": "string"
    },
    "location": {
      "type": "string"
    },
    "logo_url": {
      "type": "string"
    }
  }
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/api/companies/{id}',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PUT /api/companies/{id}`

*Modyfikuje dane istniejącej firmy*

Aktualizuje informacje o firmie na podstawie przekazanego ID. Zmiany są analizowane i zapisywane w logach audytowych.

> Body parameter

```json
{
  "type": "object",
  "required": [
    "name"
  ],
  "properties": {
    "name": {
      "type": "string"
    },
    "location": {
      "type": "string"
    },
    "logo_url": {
      "type": "string"
    }
  }
}
```

<h3 id="put__api_companies_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer|true|ID firmy do edycji|
|body|body|object|true|none|
|» name|body|string|true|none|
|» location|body|string|false|none|
|» logo_url|body|string|false|none|

<h3 id="put__api_companies_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Firma zaktualizowana pomyślnie (lub brak zmian do zapisania).|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Brak dostępu.|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Nie znaleziono firmy o podanym ID.|None|

<aside class="success">
This operation does not require authentication
</aside>

## delete__api_companies_{id}

> Code samples

```javascript

fetch('/api/companies/{id}',
{
  method: 'DELETE'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /api/companies/{id}`

*Usuwa firmę*

Usuwa wskazaną firmę z bazy danych. Operacja nie powiedzie się, jeśli do firmy przypisane są aktywne oferty pracy (błąd klucza obcego).

<h3 id="delete__api_companies_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer|true|ID firmy do usunięcia|

<h3 id="delete__api_companies_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Firma usunięta pomyślnie.|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Nie można usunąć firmy (naruszenie więzów integralności - firma posiada oferty).|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Brak dostępu.|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Nie znaleziono firmy do usunięcia.|None|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="api-systemu-rekrutacyjnego-auth">Auth</h1>

## post__api_auth_login

> Code samples

```javascript
const inputBody = '{
  "type": "object",
  "required": [
    "username",
    "password"
  ],
  "properties": {
    "username": {
      "type": "string",
      "description": "Nazwa użytkownika (lub email, w zależności od konfiguracji Passport)",
      "example": "admin"
    },
    "password": {
      "type": "string",
      "description": "Hasło użytkownika",
      "example": "admin123"
    }
  }
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/api/auth/login',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/auth/login`

*Logowanie użytkownika do systemu*

Uwierzytelnia użytkownika przy użyciu lokalnej strategii (Passport.js) i tworzy nową sesję opartą na ciasteczkach.

> Body parameter

```json
{
  "type": "object",
  "required": [
    "username",
    "password"
  ],
  "properties": {
    "username": {
      "type": "string",
      "description": "Nazwa użytkownika (lub email, w zależności od konfiguracji Passport)",
      "example": "admin"
    },
    "password": {
      "type": "string",
      "description": "Hasło użytkownika",
      "example": "admin123"
    }
  }
}
```

<h3 id="post__api_auth_login-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» username|body|string|true|Nazwa użytkownika (lub email, w zależności od konfiguracji Passport)|
|» password|body|string|true|Hasło użytkownika|

> Example responses

> 200 Response

```json
{
  "type": "object",
  "properties": {
    "message": {
      "type": "string",
      "example": "Zalogowano pomyślnie"
    },
    "user": {
      "type": "object",
      "description": "Obiekt zawierający dane zalogowanego użytkownika"
    }
  }
}
```

<h3 id="post__api_auth_login-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Zalogowano pomyślnie|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Błąd autoryzacji (np. nieprawidłowe hasło lub brakujący użytkownik)|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Wewnętrzny błąd serwera podczas logowania|None|

<h3 id="post__api_auth_login-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» user|object|false|none|Obiekt zawierający dane zalogowanego użytkownika|

Status Code **401**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» error|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_auth_logout

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/api/auth/logout',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/auth/logout`

*Wylogowanie użytkownika*

Niszczy aktualną sesję użytkownika na serwerze i czyści ciasteczko sesyjne.

> Example responses

> 200 Response

```json
{
  "type": "object",
  "properties": {
    "message": {
      "type": "string",
      "example": "Wylogowano pomyślnie"
    }
  }
}
```

<h3 id="post__api_auth_logout-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Pomyślnie wylogowano|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Wewnętrzny błąd serwera podczas wylogowywania|None|

<h3 id="post__api_auth_logout-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## get__api_auth_me

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/api/auth/me',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/auth/me`

*Weryfikacja aktywnej sesji (Pobieranie danych o sobie)*

Sprawdza, czy użytkownik posiada aktywne ciasteczko sesyjne. Jeśli tak, zwraca jego zdekodowane dane z bazy. Używane przez frontend do utrzymywania stanu logowania po odświeżeniu strony.

> Example responses

> 200 Response

```json
{
  "type": "object",
  "properties": {
    "user": {
      "type": "object",
      "description": "Pełne dane autoryzowanego użytkownika pochodzące z sesji"
    }
  }
}
```

<h3 id="get__api_auth_me-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Sesja jest aktywna|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Brak aktywnej sesji (użytkownik niezalogowany)|Inline|

<h3 id="get__api_auth_me-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» user|object|false|none|Pełne dane autoryzowanego użytkownika pochodzące z sesji|

Status Code **401**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» error|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="api-systemu-rekrutacyjnego-applications">Applications</h1>

## get__api_applications_stats

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/api/applications/stats',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/applications/stats`

*Pobiera statystyki zgłoszeń (wykorzystywane do generowania wykresu)*

Zwraca liczbę wszystkich aplikacji pogrupowaną po nazwach firm. Wymaga roli RECRUITER.

> Example responses

> 200 Response

```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "company": {
        "type": "string",
        "example": "TechCorp"
      },
      "count": {
        "type": "integer",
        "example": 14
      }
    }
  }
}
```

<h3 id="get__api_applications_stats-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Zestawienie statystyk.|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Brak dostępu (niezalogowany).|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Brak uprawnień (wymagana rola RECRUITER).|None|

<h3 id="get__api_applications_stats-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» company|string|false|none|none|
|» count|integer|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## get__api_applications

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/api/applications',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/applications`

*Pobiera listę wszystkich zgłoszeń z systemu*

Zwraca listę wszystkich aplikacji powiązanych z odpowiednią ofertą i firmą. Wymaga roli RECRUITER.

> Example responses

> 200 Response

```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "id": {
        "type": "integer"
      },
      "job_id": {
        "type": "integer"
      },
      "user_id": {
        "type": "integer"
      },
      "first_name": {
        "type": "string"
      },
      "last_name": {
        "type": "string"
      },
      "email": {
        "type": "string"
      },
      "phone": {
        "type": "string"
      },
      "cv_link": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "status": {
        "type": "string"
      },
      "created_at": {
        "type": "string",
        "format": "date-time"
      },
      "job_title": {
        "type": "string"
      },
      "company_name": {
        "type": "string"
      }
    }
  }
}
```

<h3 id="get__api_applications-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Tablica ze zgłoszeniami|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Brak dostępu.|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Brak uprawnień (wymagana rola RECRUITER).|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Błąd wewnętrzny serwera.|None|

<h3 id="get__api_applications-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» id|integer|false|none|none|
|» job_id|integer|false|none|none|
|» user_id|integer|false|none|none|
|» first_name|string|false|none|none|
|» last_name|string|false|none|none|
|» email|string|false|none|none|
|» phone|string|false|none|none|
|» cv_link|string|false|none|none|
|» message|string|false|none|none|
|» status|string|false|none|none|
|» created_at|string(date-time)|false|none|none|
|» job_title|string|false|none|none|
|» company_name|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_applications

> Code samples

```javascript
const inputBody = '{
  "type": "object",
  "required": [
    "job_id",
    "first_name",
    "last_name",
    "email",
    "phone",
    "cv_file"
  ],
  "properties": {
    "job_id": {
      "type": "integer"
    },
    "first_name": {
      "type": "string"
    },
    "last_name": {
      "type": "string"
    },
    "email": {
      "type": "string"
    },
    "phone": {
      "type": "string"
    },
    "message": {
      "type": "string"
    },
    "cv_file": {
      "type": "string",
      "format": "binary",
      "description": "Plik PDF/DOC (załącznik z CV)"
    }
  }
}';
const headers = {
  'Content-Type':'multipart/form-data'
};

fetch('/api/applications',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/applications`

*Wysyła nową aplikację na ofertę pracy wraz z plikiem CV*

Przetwarza dane formularza i przesyła plik. Emituje 'NEW_APPLICATION' przez WebSockets.

> Body parameter

```yaml
type: object
required:
  - job_id
  - first_name
  - last_name
  - email
  - phone
  - cv_file
properties:
  job_id:
    type: integer
  first_name:
    type: string
  last_name:
    type: string
  email:
    type: string
  phone:
    type: string
  message:
    type: string
  cv_file:
    type: string
    format: binary
    description: Plik PDF/DOC (załącznik z CV)

```

<h3 id="post__api_applications-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» job_id|body|integer|true|none|
|» first_name|body|string|true|none|
|» last_name|body|string|true|none|
|» email|body|string|true|none|
|» phone|body|string|true|none|
|» message|body|string|false|none|
|» cv_file|body|string(binary)|true|Plik PDF/DOC (załącznik z CV)|

<h3 id="post__api_applications-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Sukces.|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Niezalogowany (brak sesji/ciastka).|None|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|Błąd walidacji danych (np. brak CV lub zły format emaila).|None|

<aside class="success">
This operation does not require authentication
</aside>

## put__api_applications_{id}_status

> Code samples

```javascript
const inputBody = '{
  "type": "object",
  "properties": {
    "status": {
      "type": "string",
      "enum": [
        "OCZEKUJĄCE",
        "ZAAKCEPTOWANE",
        "ODRZUCONE"
      ]
    }
  }
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/api/applications/{id}/status',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PUT /api/applications/{id}/status`

*Zmienia status aplikacji (np. ZAAKCEPTOWANE / ODRZUCONE)*

Aktualizuje status zgłoszenia. W przypadku sukcesu emituje zdarzenie 'STATUS_CHANGED' poprzez WebSockets do klientów (Rekruter i Kandydat).

> Body parameter

```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "string",
      "enum": [
        "OCZEKUJĄCE",
        "ZAAKCEPTOWANE",
        "ODRZUCONE"
      ]
    }
  }
}
```

<h3 id="put__api_applications_{id}_status-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer|true|ID aplikacji|
|body|body|object|true|none|
|» status|body|string|false|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|» status|OCZEKUJĄCE|
|» status|ZAAKCEPTOWANE|
|» status|ODRZUCONE|

<h3 id="put__api_applications_{id}_status-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Sukces. Zwraca potwierdzenie zmiany.|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Nieprawidłowy status.|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Nie znaleziono aplikacji o podanym ID.|None|

<aside class="success">
This operation does not require authentication
</aside>

## get__api_applications_my-applications

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/api/applications/my-applications',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/applications/my-applications`

*Pobiera listę zgłoszeń wysłanych przez obecnie zalogowanego kandydata*

> Example responses

> 200 Response

```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "id": {
        "type": "integer"
      },
      "status": {
        "type": "string"
      },
      "created_at": {
        "type": "string",
        "format": "date-time"
      },
      "job_title": {
        "type": "string"
      },
      "company_name": {
        "type": "string"
      }
    }
  }
}
```

<h3 id="get__api_applications_my-applications-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Tablica aplikacji należących do zalogowanego użytkownika.|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Niezalogowany.|None|

<h3 id="get__api_applications_my-applications-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» id|integer|false|none|none|
|» status|string|false|none|none|
|» created_at|string(date-time)|false|none|none|
|» job_title|string|false|none|none|
|» company_name|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="api-systemu-rekrutacyjnego-admin">Admin</h1>

## post__api_admin_upload-csv

> Code samples

```javascript
const inputBody = '{
  "type": "object"
}';
const headers = {
  'Content-Type':'multipart/form-data',
  'Accept':'application/json'
};

fetch('/api/admin/upload-csv',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/admin/upload-csv`

*Masowy import danych (Firmy lub Oferty) z pliku CSV*

Pozwala administratorowi na masowe dodawanie firm lub ofert pracy z pliku CSV. Maksymalny rozmiar pliku to 2MB. Akcja zapisuje się w logach audytowych.

> Body parameter

```yaml
type: object

```

<h3 id="post__api_admin_upload-csv-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|

> Example responses

> 200 Response

```json
{
  "type": "object",
  "properties": {
    "success": {
      "type": "boolean"
    },
    "message": {
      "type": "string",
      "example": "Przetworzono CSV. Sukces: 10, Błędy: 0"
    }
  }
}
```

<h3 id="post__api_admin_upload-csv-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Pomyślnie przetworzono plik CSV.|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Błąd walidacji (np. brak pliku CSV).|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Brak dostępu (użytkownik niezalogowany lub brak uprawnień).|None|

<h3 id="post__api_admin_upload-csv-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» message|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## get__api_admin_audit-logs

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/api/admin/audit-logs',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/admin/audit-logs`

*Pobiera ostatnie 100 logów audytowych systemu*

Zwraca listę akcji wykonanych przez użytkowników systemu (np. logowania, importy, edycje), posortowaną od najnowszych.

> Example responses

> 200 Response

```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "id": {
        "type": "integer"
      },
      "user_id": {
        "type": "integer"
      },
      "username": {
        "type": "string"
      },
      "action": {
        "type": "string"
      },
      "details": {
        "type": "string"
      },
      "created_at": {
        "type": "string",
        "format": "date-time"
      }
    }
  }
}
```

<h3 id="get__api_admin_audit-logs-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Lista logów audytowych.|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Brak dostępu (wymagane uprawnienia administratora).|None|

<h3 id="get__api_admin_audit-logs-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» id|integer|false|none|none|
|» user_id|integer|false|none|none|
|» username|string|false|none|none|
|» action|string|false|none|none|
|» details|string|false|none|none|
|» created_at|string(date-time)|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_admin_upload-logo

> Code samples

```javascript
const inputBody = '{
  "type": "object",
  "required": [
    "logo",
    "company_id"
  ],
  "properties": {
    "logo": {
      "type": "string",
      "format": "binary",
      "description": "Plik graficzny (np. PNG, JPG)"
    },
    "company_id": {
      "type": "integer",
      "description": "ID firmy, do której przypisane zostanie logo"
    }
  }
}';
const headers = {
  'Content-Type':'multipart/form-data',
  'Accept':'application/json'
};

fetch('/api/admin/upload-logo',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/admin/upload-logo`

*Wgrywa logotyp dla konkretnej firmy*

Przyjmuje plik graficzny, zapisuje go na serwerze i przypisuje ścieżkę do wskazanej firmy w bazie danych. Wymaga autoryzacji admina.

> Body parameter

```yaml
type: object
required:
  - logo
  - company_id
properties:
  logo:
    type: string
    format: binary
    description: Plik graficzny (np. PNG, JPG)
  company_id:
    type: integer
    description: ID firmy, do której przypisane zostanie logo

```

<h3 id="post__api_admin_upload-logo-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» logo|body|string(binary)|true|Plik graficzny (np. PNG, JPG)|
|» company_id|body|integer|true|ID firmy, do której przypisane zostanie logo|

> Example responses

> 200 Response

```json
{
  "type": "object",
  "properties": {
    "message": {
      "type": "string",
      "example": "Logo firmy zaktualizowane!"
    },
    "logoUrl": {
      "type": "string",
      "example": "/uploads/logos/logo-1678901234-56789.png"
    }
  }
}
```

<h3 id="post__api_admin_upload-logo-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Logo wgrane i przypisane pomyślnie.|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Błąd walidacji (brak pliku lub ID firmy).|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Brak dostępu.|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Wewnętrzny błąd serwera.|None|

<h3 id="post__api_admin_upload-logo-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» logoUrl|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

