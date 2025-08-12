from functools import wraps
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ValidationError, PermissionDenied
from django.http import Http404
from rest_framework.exceptions import APIException
import traceback
from datetime import datetime

def handle_exceptions(func):
    """
    Обработчик ошибок для API endpoints
    Обрабатывает различные типы исключений и возвращает соответствующие HTTP статусы
    Текущие обрабоки:
    - Ошибки валидации - HTTP400
    - Объект не найден - HTTP404
    - Ошибки доступа - HTTP403
    - Обработки DRF исключений - вернется статус код от DRF
    - Необработанные исключения - HTTP500

    Автоматически выводит все ошибки в консоль с временной меткой.
    """
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except ValidationError as e:
            # ошибки валидации
            print(f"\n[{datetime.now()}] VALIDATION ERROR in {func.__name__}:")
            print(f"Error details: {e.messages if hasattr(e, 'messages') else str(e)}\n")
            return Response(
                {"error": e.messages if hasattr(e, 'messages') else str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Http404 as e:
            # объект не найден
            print(f"\n[{datetime.now()}] NOT FOUND ERROR in {func.__name__}:")
            print(f"Error details: {str(e) or 'Запрашиваемый ресурс не найден'}\n")
            return Response(
                {"error": str(e) or "Запрашиваемый ресурс не найден"},
                status=status.HTTP_404_NOT_FOUND
            )
        except PermissionDenied as e:
            # ошибки доступа
            print(f"\n[{datetime.now()}] PERMISSION ERROR in {func.__name__}:")
            print(f"Error details: {str(e) or 'У вас нет прав для выполнения этого действия'}\n")
            return Response(
                {"error": str(e) or "У вас нет прав для выполнения этого действия"},
                status=status.HTTP_403_FORBIDDEN
            )
        except APIException as e:
            # обработка DRF исключений
            print(f"\n[{datetime.now()}] API ERROR in {func.__name__}:")
            print(f"Error details: {str(e)}")
            print(f"Status code: {e.status_code}\n")
            return Response(
                {"error": str(e)},
                status=e.status_code
            )
        except Exception as e:
            # необработанные исключения
            print(f"\n[{datetime.now()}] UNHANDLED ERROR in {func.__name__}:")
            print(f"Error type: {type(e).__name__}")
            print(f"Error details: {str(e)}")
            print("Traceback:")
            print(traceback.format_exc())
            print()  # пустая строка для разделения
            return Response(
                {
                    "error": "Произошла внутренняя ошибка сервера",
                    "detail": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    return wrapper
