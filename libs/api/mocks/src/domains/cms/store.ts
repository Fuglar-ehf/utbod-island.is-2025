import {
  article,
  articleCategory,
  alertBanner as createAlertBanner,
  menu as createMenu,
  groupedMenu as createGroupedMenu,
  news,
  lifeEvent,
  frontPageSlider,
  homepage as createHomepage,
  articleGroup,
  articleSubgroup,
  featured,
  genericPage,
  referenceLink,
  frontpage as createFrontpage,
} from './factories'
import orderBy from 'lodash/orderBy'
import { Article } from '../../types'
import { createStore, faker } from '@island.is/shared/mocking'

export const store = createStore(() => {
  faker.seed(100)

  const articleCategories = articleCategory.list(5)

  // Create articles, groups and subgroups in every category.
  const articles = articleCategories.reduce<Article[]>((articles, category) => {
    const groups = articleGroup.list(faker.random.number({ min: 2, max: 4 }))

    for (const group of groups) {
      const subGroups =
        faker.random.number(4) === 0
          ? []
          : articleSubgroup.list(faker.random.number({ min: 2, max: 4 }))

      const groupArticles = article.list(subGroups.length * 2 + 2, {
        group,
        category,
        subgroup: () =>
          subGroups.length > 0 ? faker.random.arrayElement(subGroups) : null,
      })
      articles = articles.concat(groupArticles)
    }
    return articles
  }, [])

  const groupedMenu = createGroupedMenu()

  const alertBanner = createAlertBanner()

  const menu = createMenu()

  const newsList = orderBy(news.list(12), ['date'], ['desc'])

  const lifeEvents = lifeEvent.list(6, {
    category: () => faker.random.arrayElement(articleCategories),
  })

  const frontpage = {
    ...createFrontpage(),
    ...{ namespace: { namespace: 'homepage', fields: '{}' } },
  }

  const frontPageSliders = frontPageSlider.list(3)

  const homepage = createHomepage({
    featuredThings: featured.list(3, {
      thing: () => referenceLink(),
    }),
  })

  const genericPages = [genericPage({ title: 'Loftbrú', slug: 'loftbru' })]

  return {
    homepage,
    frontpage,
    frontPageSliders,
    lifeEvents,
    newsList,
    alertBanner,
    menu,
    groupedMenu,
    articles,
    articleCategories,
    genericPages,
  }
})
