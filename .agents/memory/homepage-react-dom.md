---
name: DOM React da página inicial
description: Regra para personalizar a home renderizada por React sem quebrar a reconciliação.
---

Mantenha intactos os filhos de `#root` controlados pelo React: atualize os nós de texto existentes, preserve os botões originais e oculte seções com CSS. Um gráfico independente pode ficar fora de `#root`.

**Why:** substituir botões ou remover seções fora do ciclo do React provocou um `NotFoundError` na próxima reconciliação.

**How to apply:** ao ajustar textos, CTAs ou seções da home, não remova nem substitua os nós React-gerenciados; altere textos e estilos sem desanexá-los.