from django.db import models

STATUS_DEFAULT = 'new'
STATUS_CHOICES = [(STATUS_DEFAULT,'новая'),('checked','проверена')]


class Quote(models.Model):
    text = models.TextField(max_length=300, null=False, blank=False, verbose_name='Текст цитаты')
    author = models.CharField(max_length=20, null=False, blank=False, verbose_name='Автор')
    email = models.EmailField(verbose_name='email автора')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, verbose_name='Статус', default=STATUS_DEFAULT)
    rating = models.IntegerField(default=0, verbose_name='Рейтинг')
    added = models.DateTimeField(auto_now_add=True, verbose_name='Дата добавления')

    def __str__(self):
        return 'Цитата "{}" пользователя {}'.format(self.text[:10], self.author)
