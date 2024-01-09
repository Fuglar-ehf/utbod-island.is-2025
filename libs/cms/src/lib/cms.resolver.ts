import { CacheControl, CacheControlOptions } from '@island.is/nest/graphql'
import { CACHE_CONTROL_MAX_AGE } from '@island.is/shared/constants'
import { Args, Query, Resolver, ResolveField, Parent } from '@nestjs/graphql'
import { Article } from './models/article.model'
import { ContentSlug } from './models/contentSlug.model'
import { AdgerdirPage } from './models/adgerdirPage.model'
import { Organization } from './models/organization.model'
import { Organizations } from './models/organizations.model'
import { AdgerdirPages } from './models/adgerdirPages.model'
import { AdgerdirFrontpage } from './models/adgerdirFrontpage.model'
import { News } from './models/news.model'
import { GetSingleNewsInput } from './dto/getSingleNews.input'
import { GetAdgerdirPageInput } from './dto/getAdgerdirPage.input'
import { GetOrganizationTagsInput } from './dto/getOrganizationTags.input'
import { GetAdgerdirPagesInput } from './dto/getAdgerdirPages.input'
import { GetOrganizationsInput } from './dto/getOrganizations.input'
import { GetOrganizationInput } from './dto/getOrganization.input'
import { GetAdgerdirFrontpageInput } from './dto/getAdgerdirFrontpage.input'
import { GetErrorPageInput } from './dto/getErrorPage.input'
import { Namespace } from './models/namespace.model'
import { AlertBanner } from './models/alertBanner.model'
import { GenericPage } from './models/genericPage.model'
import { GenericOverviewPage } from './models/genericOverviewPage.model'
import { GetNamespaceInput } from './dto/getNamespace.input'
import { GetAlertBannerInput } from './dto/getAlertBanner.input'
import { GetGenericPageInput } from './dto/getGenericPage.input'
import { GetGenericOverviewPageInput } from './dto/getGenericOverviewPage.input'
import { GetAnchorPageInput } from './dto/getAnchorPage.input'
import { GetAnchorPagesInput } from './dto/getAnchorPages.input'
import { Menu } from './models/menu.model'
import { GetMenuInput } from './dto/getMenu.input'
import { AdgerdirTags } from './models/adgerdirTags.model'
import { GetAdgerdirTagsInput } from './dto/getAdgerdirTags.input'
import { AnchorPage } from './models/anchorPage.model'
import { OrganizationTags } from './models/organizationTags.model'
import { CmsContentfulService } from './cms.contentful.service'
import { CmsElasticsearchService } from './cms.elasticsearch.service'
import { PowerBiService } from './powerbi.service'
import { ArticleCategory } from './models/articleCategory.model'
import { GetArticleCategoriesInput } from './dto/getArticleCategories.input'
import { GetArticlesInput } from './dto/getArticles.input'
import { GetContentSlugInput } from './dto/getContentSlug.input'
import { GetUrlInput } from './dto/getUrl.input'
import { Url } from './models/url.model'
import { GetSingleArticleInput } from './dto/getSingleArticle.input'
import { LatestNewsSlice } from './models/latestNewsSlice.model'
import { GetNewsInput } from './dto/getNews.input'
import { GetNewsDatesInput } from './dto/getNewsDates.input'
import { NewsList } from './models/newsList.model'
import { GroupedMenu } from './models/groupedMenu.model'
import { GetSingleMenuInput } from './dto/getSingleMenu.input'
import { SubpageHeader } from './models/subpageHeader.model'
import { GetSubpageHeaderInput } from './dto/getSubpageHeader.input'
import { ErrorPage } from './models/errorPage.model'
import { OrganizationSubpage } from './models/organizationSubpage.model'
import { GetOrganizationSubpageInput } from './dto/getOrganizationSubpage.input'
import { getElasticsearchIndex } from '@island.is/content-search-index-manager'
import { OrganizationPage } from './models/organizationPage.model'
import { GetOrganizationPageInput } from './dto/getOrganizationPage.input'
import { GetAuctionsInput } from './dto/getAuctions.input'
import { Auction } from './models/auction.model'
import { GetAuctionInput } from './dto/getAuction.input'
import { Frontpage } from './models/frontpage.model'
import { GetFrontpageInput } from './dto/getFrontpage.input'
import { OpenDataPage } from './models/openDataPage.model'
import { GetOpenDataPageInput } from './dto/getOpenDataPage.input'
import { OpenDataSubpage } from './models/openDataSubpage.model'
import { GetOpenDataSubpageInput } from './dto/getOpenDataSubpage.input'
import { ProjectPage } from './models/projectPage.model'
import { GetProjectPageInput } from './dto/getProjectPage.input'
import { SupportQNA } from './models/supportQNA.model'
import { GetSupportQNAsInput } from './dto/getSupportQNAs.input'
import { SupportCategory } from './models/supportCategory.model'
import { GetSupportCategoryInput } from './dto/getSupportCategory.input'
import { GetSupportQNAsInCategoryInput } from './dto/getSupportQNAsInCategory.input'
import { GetSupportCategoriesInput } from './dto/getSupportCategories.input'
import { GetSupportCategoriesInOrganizationInput } from './dto/getSupportCategoriesInOrganization.input'
import { GetPublishedMaterialInput } from './dto/getPublishedMaterial.input'
import { EnhancedAssetSearchResult } from './models/enhancedAssetSearchResult.model'
import { GetSingleSupportQNAInput } from './dto/getSingleSupportQNA.input'
import { GetFeaturedSupportQNAsInput } from './dto/getFeaturedSupportQNAs.input'
import { Locale } from '@island.is/shared/types'
import { FeaturedArticles } from './models/featuredArticles.model'
import { GetServicePortalAlertBannersInput } from './dto/getServicePortalAlertBanners.input'
import { GetTabSectionInput } from './dto/getTabSection.input'
import { TabSection } from './models/tabSection.model'
import { GenericTag } from './models/genericTag.model'
import { GetGenericTagBySlugInput } from './dto/getGenericTagBySlug.input'
import { FeaturedSupportQNAs } from './models/featuredSupportQNAs.model'
import { PowerBiSlice } from './models/powerBiSlice.model'
import { GetPowerBiEmbedPropsFromServerResponse } from './dto/getPowerBiEmbedPropsFromServer.response'
import { GetOrganizationByTitleInput } from './dto/getOrganizationByTitle.input'
import { ServiceWebPage } from './models/serviceWebPage.model'
import { GetServiceWebPageInput } from './dto/getServiceWebPage.input'
import { LatestEventsSlice } from './models/latestEventsSlice.model'
import { Event as EventModel } from './models/event.model'
import { GetSingleEventInput } from './dto/getSingleEvent.input'
import { GetEventsInput } from './dto/getEvents.input'
import { EventList } from './models/eventList.model'
import { Manual } from './models/manual.model'
import { GetSingleManualInput } from './dto/getSingleManual.input'
import { GetSingleEntryTitleByIdInput } from './dto/getSingleEntryTitleById.input'
import { EntryTitle } from './models/entryTitle.model'
import { LifeEventPage } from './models/lifeEventPage.model'
import { GetLifeEventPageInput } from './dto/getLifeEventPage.input'
import { GetLifeEventsInput } from './dto/getLifeEvents.input'
import { GetLifeEventsInCategoryInput } from './dto/getLifeEventsInCategory.input'
import { CategoryPage } from './models/categoryPage.model'
import { GetCategoryPagesInput } from './dto/getCategoryPages.input'

const defaultCache: CacheControlOptions = { maxAge: CACHE_CONTROL_MAX_AGE }

// Since "icelandic-health-insurance" is now "iceland-health", these constants
// are used to fallback to older slug to prevent "downtime" during 27.1.0 deployment and will be removed afterwards
const ICELAND_HEALTH = 'iceland-health'
const ICELANDIC_HEALTH_INSURANCE = 'icelandic-health-insurance'

@Resolver()
export class CmsResolver {
  constructor(
    private readonly cmsContentfulService: CmsContentfulService,
    private readonly cmsElasticsearchService: CmsElasticsearchService,
  ) {}

  @CacheControl(defaultCache)
  @Query(() => Namespace, { nullable: true })
  getNamespace(
    @Args('input') input: GetNamespaceInput,
  ): Promise<Namespace | null> {
    return this.cmsContentfulService.getNamespace(
      input?.namespace ?? '',
      input?.lang ?? 'is-IS',
    )
  }

  // TODO: Change this so this won't link to non existing entries e.g. articles
  @CacheControl(defaultCache)
  @Query(() => ContentSlug, { nullable: true })
  getContentSlug(
    @Args('input') input: GetContentSlugInput,
  ): Promise<ContentSlug | null> {
    return this.cmsContentfulService.getContentSlug(input)
  }

  @CacheControl({ maxAge: 10 })
  @Query(() => AlertBanner, { nullable: true })
  getAlertBanner(
    @Args('input') input: GetAlertBannerInput,
  ): Promise<AlertBanner | null> {
    return this.cmsContentfulService.getAlertBanner(input)
  }

  @CacheControl(defaultCache)
  @Query(() => [AlertBanner], { nullable: true })
  getServicePortalAlertBanners(
    @Args('input') input: GetServicePortalAlertBannersInput,
  ): Promise<AlertBanner[] | null> {
    return this.cmsContentfulService.getServicePortalAlertBanners(input)
  }

  @CacheControl(defaultCache)
  @Query(() => GenericPage, { nullable: true })
  getGenericPage(
    @Args('input') input: GetGenericPageInput,
  ): Promise<GenericPage | null> {
    return this.cmsContentfulService.getGenericPage(input)
  }

  @CacheControl(defaultCache)
  @Query(() => GenericOverviewPage, { nullable: true })
  getGenericOverviewPage(
    @Args('input') input: GetGenericOverviewPageInput,
  ): Promise<GenericOverviewPage | null> {
    return this.cmsContentfulService.getGenericOverviewPage(input)
  }

  @CacheControl(defaultCache)
  @Query(() => AdgerdirPage, { nullable: true })
  getAdgerdirPage(
    @Args('input') input: GetAdgerdirPageInput,
  ): Promise<AdgerdirPage | null> {
    return this.cmsContentfulService.getAdgerdirPage(
      input?.slug ?? '',
      input?.lang ?? 'is-IS',
    )
  }

  @CacheControl(defaultCache)
  @Query(() => ErrorPage, { nullable: true })
  getErrorPage(
    @Args('input') input: GetErrorPageInput,
  ): Promise<ErrorPage | null> {
    return this.cmsContentfulService.getErrorPage(input)
  }

  @CacheControl(defaultCache)
  @Query(() => OpenDataPage)
  getOpenDataPage(
    @Args('input') input: GetOpenDataPageInput,
  ): Promise<OpenDataPage | null> {
    return this.cmsContentfulService.getOpenDataPage(input)
  }

  @CacheControl(defaultCache)
  @Query(() => OpenDataSubpage)
  getOpenDataSubpage(
    @Args('input') input: GetOpenDataSubpageInput,
  ): Promise<OpenDataSubpage | null> {
    return this.cmsContentfulService.getOpenDataSubpage(input)
  }

  @CacheControl(defaultCache)
  @Query(() => Organization, { nullable: true })
  async getOrganization(
    @Args('input') input: GetOrganizationInput,
  ): Promise<Organization | null> {
    const slug = input?.slug ?? ''
    let response = await this.cmsContentfulService.getOrganization(
      slug,
      input?.lang ?? 'is-IS',
    )
    if (!response && slug === ICELAND_HEALTH) {
      response = await this.cmsContentfulService.getOrganization(
        ICELANDIC_HEALTH_INSURANCE,
        input?.lang ?? 'is-IS',
      )
    }
    return response
  }

  @CacheControl(defaultCache)
  @Query(() => Organization, { nullable: true })
  getOrganizationByTitle(
    @Args('input') input: GetOrganizationByTitleInput,
  ): Promise<Organization | null> {
    return this.cmsContentfulService.getOrganizationByTitle(
      input?.title ?? '',
      input?.lang ?? 'is-IS',
    )
  }

  @CacheControl(defaultCache)
  @Query(() => OrganizationPage, { nullable: true })
  async getOrganizationPage(
    @Args('input') input: GetOrganizationPageInput,
  ): Promise<OrganizationPage | null> {
    let response: OrganizationPage | null =
      await this.cmsElasticsearchService.getSingleDocumentTypeBySlug(
        getElasticsearchIndex(input.lang),
        { type: 'webOrganizationPage', slug: input.slug },
      )
    if (!response && input.slug === ICELAND_HEALTH) {
      response = await this.cmsElasticsearchService.getSingleDocumentTypeBySlug(
        getElasticsearchIndex(input.lang),
        { type: 'webOrganizationPage', slug: ICELANDIC_HEALTH_INSURANCE },
      )
    }
    return response
  }

  @CacheControl(defaultCache)
  @Query(() => OrganizationSubpage, { nullable: true })
  async getOrganizationSubpage(
    @Args('input') input: GetOrganizationSubpageInput,
  ): Promise<OrganizationSubpage | null> {
    let response =
      await this.cmsElasticsearchService.getSingleOrganizationSubpage(
        getElasticsearchIndex(input.lang),
        { ...input },
      )

    if (!response && input.organizationSlug === ICELAND_HEALTH) {
      response =
        await this.cmsElasticsearchService.getSingleOrganizationSubpage(
          getElasticsearchIndex(input.lang),
          { ...input, organizationSlug: ICELANDIC_HEALTH_INSURANCE },
        )
    }

    return response
  }

  @CacheControl(defaultCache)
  @Query(() => ServiceWebPage, { nullable: true })
  async getServiceWebPage(
    @Args('input') input: GetServiceWebPageInput,
  ): Promise<ServiceWebPage | null> {
    let response: ServiceWebPage | null =
      await this.cmsElasticsearchService.getSingleDocumentTypeBySlug(
        getElasticsearchIndex(input.lang),
        { type: 'webServiceWebPage', slug: input.slug },
      )
    if (!response && input.slug === ICELAND_HEALTH) {
      response = await this.cmsElasticsearchService.getSingleDocumentTypeBySlug(
        getElasticsearchIndex(input.lang),
        { type: 'webServiceWebPage', slug: ICELANDIC_HEALTH_INSURANCE },
      )
    }
    return response
  }

  @CacheControl(defaultCache)
  @Query(() => [Auction])
  getAuctions(
    @Args('input') input: GetAuctionsInput,
  ): Promise<Auction[] | null> {
    return this.cmsContentfulService.getAuctions(
      input.lang,
      input.organization,
      input.year,
      input.month,
    )
  }

  @CacheControl(defaultCache)
  @Query(() => Auction)
  getAuction(@Args('input') input: GetAuctionInput): Promise<Auction | null> {
    return this.cmsContentfulService.getAuction(input.id, input.lang)
  }

  @CacheControl(defaultCache)
  @Query(() => ProjectPage, { nullable: true })
  getProjectPage(
    @Args('input') input: GetProjectPageInput,
  ): Promise<ProjectPage | null> {
    return this.cmsContentfulService.getProjectPage(input.slug, input.lang)
  }

  @CacheControl(defaultCache)
  @Query(() => AdgerdirPages)
  getAdgerdirPages(
    @Args('input') input: GetAdgerdirPagesInput,
  ): Promise<AdgerdirPages> {
    return this.cmsContentfulService.getAdgerdirPages(input?.lang ?? 'is-IS')
  }

  @CacheControl(defaultCache)
  @Query(() => Organizations)
  getOrganizations(
    @Args('input', { nullable: true }) input: GetOrganizationsInput,
  ): Promise<Organizations> {
    return this.cmsContentfulService.getOrganizations(input)
  }

  @CacheControl(defaultCache)
  @Query(() => AdgerdirTags, { nullable: true })
  getAdgerdirTags(
    @Args('input') input: GetAdgerdirTagsInput,
  ): Promise<AdgerdirTags | null> {
    return this.cmsContentfulService.getAdgerdirTags(input?.lang ?? 'is-IS')
  }

  @CacheControl(defaultCache)
  @Query(() => OrganizationTags, { nullable: true })
  getOrganizationTags(
    @Args('input') input: GetOrganizationTagsInput,
  ): Promise<OrganizationTags | null> {
    return this.cmsContentfulService.getOrganizationTags(input?.lang ?? 'is-IS')
  }

  @CacheControl(defaultCache)
  @Query(() => AdgerdirFrontpage, { nullable: true })
  getAdgerdirFrontpage(
    @Args('input') input: GetAdgerdirFrontpageInput,
  ): Promise<AdgerdirFrontpage | null> {
    return this.cmsContentfulService.getAdgerdirFrontpage(
      input?.lang ?? 'is-IS',
    )
  }

  @CacheControl(defaultCache)
  @Query(() => AnchorPage, { nullable: true })
  getAnchorPage(
    @Args('input') input: GetAnchorPageInput,
  ): Promise<AnchorPage | null> {
    return this.cmsContentfulService.getAnchorPage(input.slug, input.lang)
  }

  @CacheControl(defaultCache)
  @Query(() => [AnchorPage])
  getAnchorPages(
    @Args('input') input: GetAnchorPagesInput,
  ): Promise<AnchorPage[]> {
    return this.cmsContentfulService.getAnchorPages(input.lang)
  }

  @CacheControl(defaultCache)
  @Query(() => LifeEventPage, { nullable: true })
  getLifeEventPage(
    @Args('input') input: GetLifeEventPageInput,
  ): Promise<LifeEventPage | null> {
    return this.cmsContentfulService.getLifeEventPage(input.slug, input.lang)
  }

  @CacheControl(defaultCache)
  @Query(() => [LifeEventPage])
  getLifeEvents(
    @Args('input') input: GetLifeEventsInput,
  ): Promise<LifeEventPage[]> {
    return this.cmsContentfulService.getLifeEvents(input.lang)
  }

  @CacheControl(defaultCache)
  @Query(() => [LifeEventPage])
  getLifeEventsInCategory(
    @Args('input') input: GetLifeEventsInCategoryInput,
  ): Promise<LifeEventPage[]> {
    return this.cmsContentfulService.getLifeEventsInCategory(
      input.lang,
      input.slug,
    )
  }

  @CacheControl(defaultCache)
  @Query(() => Url, { nullable: true })
  getUrl(@Args('input') input: GetUrlInput): Promise<Url | null> {
    return this.cmsContentfulService.getUrl(
      input?.slug ?? '',
      input?.lang ?? 'is-IS',
    )
  }

  @CacheControl(defaultCache)
  @Query(() => Frontpage, { nullable: true })
  getFrontpage(
    @Args('input') input: GetFrontpageInput,
  ): Promise<Frontpage | null> {
    return this.cmsElasticsearchService.getSingleDocumentTypeBySlug(
      getElasticsearchIndex(input.lang),
      { type: 'webFrontpage', slug: input.pageIdentifier },
    )
  }

  @CacheControl(defaultCache)
  @Query(() => [ArticleCategory])
  getArticleCategories(
    @Args('input') input: GetArticleCategoriesInput,
  ): Promise<ArticleCategory[]> {
    return this.cmsElasticsearchService.getArticleCategories(
      getElasticsearchIndex(input.lang),
      input,
    )
  }

  @CacheControl(defaultCache)
  @Query(() => Article, { nullable: true })
  async getSingleArticle(
    @Args('input') { lang, slug }: GetSingleArticleInput,
  ): Promise<(Partial<Article> & { lang: Locale }) | null> {
    const article: Article | null =
      await this.cmsElasticsearchService.getSingleDocumentTypeBySlug<Article>(
        getElasticsearchIndex(lang),
        { type: 'webArticle', slug },
      )

    if (!article) return null

    return {
      ...article,
      lang,
    }
  }

  @CacheControl(defaultCache)
  @Query(() => [Article])
  async getArticles(
    @Args('input') input: GetArticlesInput,
  ): Promise<Article[]> {
    let response = await this.cmsElasticsearchService.getArticles(
      getElasticsearchIndex(input.lang),
      input,
    )
    if (!response.length && input.organization === ICELAND_HEALTH) {
      response = await this.cmsElasticsearchService.getArticles(
        getElasticsearchIndex(input.lang),
        { ...input, organization: ICELANDIC_HEALTH_INSURANCE },
      )
    }
    return response
  }

  @CacheControl(defaultCache)
  @Query(() => News, { nullable: true })
  getSingleNews(
    @Args('input') { lang, slug }: GetSingleNewsInput,
  ): Promise<News | null> {
    return this.cmsElasticsearchService.getSingleDocumentTypeBySlug<News>(
      getElasticsearchIndex(lang),
      { type: 'webNews', slug },
    )
  }

  @CacheControl(defaultCache)
  @Query(() => EventModel, { nullable: true })
  getSingleEvent(
    @Args('input') { lang, slug }: GetSingleEventInput,
  ): Promise<EventModel | null> {
    return this.cmsElasticsearchService.getSingleDocumentTypeBySlug<EventModel>(
      getElasticsearchIndex(lang),
      { type: 'webEvent', slug },
    )
  }

  @CacheControl(defaultCache)
  @Query(() => EventList)
  async getEvents(@Args('input') input: GetEventsInput): Promise<EventList> {
    let response = await this.cmsElasticsearchService.getEvents(
      getElasticsearchIndex(input.lang),
      input,
    )
    if (!response.items.length && input.organization === ICELAND_HEALTH) {
      response = await this.cmsElasticsearchService.getEvents(
        getElasticsearchIndex(input.lang),
        { ...input, organization: ICELANDIC_HEALTH_INSURANCE },
      )
    }
    return response
  }

  @CacheControl(defaultCache)
  @Query(() => [String])
  async getNewsDates(
    @Args('input') input: GetNewsDatesInput,
  ): Promise<string[]> {
    let response = await this.cmsElasticsearchService.getNewsDates(
      getElasticsearchIndex(input.lang),
      input,
    )
    if (!response.length && input.organization === ICELAND_HEALTH) {
      response = await this.cmsElasticsearchService.getNewsDates(
        getElasticsearchIndex(input.lang),
        { ...input, organization: ICELANDIC_HEALTH_INSURANCE },
      )
    }
    return response
  }

  @CacheControl(defaultCache)
  @Query(() => NewsList)
  async getNews(@Args('input') input: GetNewsInput): Promise<NewsList> {
    let response = await this.cmsElasticsearchService.getNews(
      getElasticsearchIndex(input.lang),
      input,
    )
    if (!response.items.length && input.organization === ICELAND_HEALTH) {
      response = await this.cmsElasticsearchService.getNews(
        getElasticsearchIndex(input.lang),
        { ...input, organization: ICELANDIC_HEALTH_INSURANCE },
      )
    }
    return response
  }

  @CacheControl(defaultCache)
  @Query(() => Menu, { nullable: true })
  getMenu(@Args('input') input: GetMenuInput): Promise<Menu | null> {
    return this.cmsElasticsearchService.getSingleMenuByName(
      getElasticsearchIndex(input.lang),
      { ...input },
    )
  }

  @CacheControl(defaultCache)
  @Query(() => GroupedMenu, { nullable: true })
  getGroupedMenu(
    @Args('input') input: GetSingleMenuInput,
  ): Promise<GroupedMenu | null> {
    return this.cmsElasticsearchService.getSingleMenu<GroupedMenu>(
      getElasticsearchIndex(input.lang),
      input,
    )
  }

  @CacheControl(defaultCache)
  @Query(() => SubpageHeader, { nullable: true })
  getSubpageHeader(
    @Args('input') input: GetSubpageHeaderInput,
  ): Promise<SubpageHeader | null> {
    return this.cmsContentfulService.getSubpageHeader(input)
  }

  @CacheControl(defaultCache)
  @Query(() => SupportQNA, { nullable: true })
  getSingleSupportQNA(
    @Args('input') { lang, slug }: GetSingleSupportQNAInput,
  ): Promise<SupportQNA | null> {
    return this.cmsElasticsearchService.getSingleDocumentTypeBySlug<SupportQNA>(
      getElasticsearchIndex(lang),
      { type: 'webQNA', slug },
    )
  }

  @CacheControl(defaultCache)
  @Query(() => [SupportQNA])
  async getFeaturedSupportQNAs(
    @Args('input') input: GetFeaturedSupportQNAsInput,
  ): Promise<SupportQNA[]> {
    let response = await this.cmsElasticsearchService.getFeaturedSupportQNAs(
      getElasticsearchIndex(input.lang),
      input,
    )
    if (!response.length && input.organization === ICELAND_HEALTH) {
      response = await this.cmsElasticsearchService.getFeaturedSupportQNAs(
        getElasticsearchIndex(input.lang),
        { ...input, organization: ICELANDIC_HEALTH_INSURANCE },
      )
    }
    return response
  }

  @CacheControl(defaultCache)
  @Query(() => [SupportQNA])
  getSupportQNAs(
    @Args('input') input: GetSupportQNAsInput,
  ): Promise<SupportQNA[]> {
    return this.cmsContentfulService.getSupportQNAs(input)
  }

  @CacheControl(defaultCache)
  @Query(() => [SupportQNA])
  getSupportQNAsInCategory(
    @Args('input') input: GetSupportQNAsInCategoryInput,
  ): Promise<SupportQNA[]> {
    return this.cmsContentfulService.getSupportQNAsInCategory(input)
  }

  @CacheControl(defaultCache)
  @Query(() => SupportCategory)
  getSupportCategory(
    @Args('input') input: GetSupportCategoryInput,
  ): Promise<SupportCategory> {
    return this.cmsContentfulService.getSupportCategory(input)
  }

  @CacheControl(defaultCache)
  @Query(() => [SupportCategory])
  getSupportCategories(
    @Args('input') input: GetSupportCategoriesInput,
  ): Promise<SupportCategory[]> {
    return this.cmsContentfulService.getSupportCategories(input)
  }

  @CacheControl(defaultCache)
  @Query(() => [SupportCategory])
  async getSupportCategoriesInOrganization(
    @Args('input') input: GetSupportCategoriesInOrganizationInput,
  ): Promise<SupportCategory[]> {
    let response =
      await this.cmsContentfulService.getSupportCategoriesInOrganization(input)
    if (!response.length && input.slug === ICELAND_HEALTH) {
      response =
        await this.cmsContentfulService.getSupportCategoriesInOrganization({
          ...input,
          slug: ICELANDIC_HEALTH_INSURANCE,
        })
    }
    return response
  }

  @CacheControl(defaultCache)
  @Query(() => EnhancedAssetSearchResult)
  async getPublishedMaterial(
    @Args('input') input: GetPublishedMaterialInput,
  ): Promise<EnhancedAssetSearchResult> {
    let response = await this.cmsElasticsearchService.getPublishedMaterial(
      getElasticsearchIndex(input.lang),
      input,
    )
    if (!response.items.length && input.organizationSlug === ICELAND_HEALTH) {
      response = await this.cmsElasticsearchService.getPublishedMaterial(
        getElasticsearchIndex(input.lang),
        { ...input, organizationSlug: ICELANDIC_HEALTH_INSURANCE },
      )
    }
    return response
  }

  @CacheControl(defaultCache)
  @Query(() => TabSection, { nullable: true })
  getTabSection(
    @Args('input') input: GetTabSectionInput,
  ): Promise<TabSection | null> {
    return this.cmsContentfulService.getTabSection(input)
  }

  @CacheControl(defaultCache)
  @Query(() => GenericTag, { nullable: true })
  getGenericTagBySlug(
    @Args('input') input: GetGenericTagBySlugInput,
  ): Promise<GenericTag | null> {
    return this.cmsContentfulService.getGenericTagBySlug(input)
  }

  @CacheControl(defaultCache)
  @Query(() => Manual, { nullable: true })
  getSingleManual(
    @Args('input') input: GetSingleManualInput,
  ): Promise<Manual | null> {
    return this.cmsElasticsearchService.getSingleDocumentTypeBySlug(
      getElasticsearchIndex(input.lang),
      { type: 'webManual', slug: input.slug },
    )
  }

  @CacheControl(defaultCache)
  @Query(() => [CategoryPage], { nullable: true })
  async getCategoryPages(
    @Args('input') input: GetCategoryPagesInput,
  ): Promise<typeof CategoryPage[] | null> {
    let response = await this.cmsElasticsearchService.getCategoryPages(
      getElasticsearchIndex(input.lang),
      input,
    )

    if (!response.length && input.organization === ICELAND_HEALTH) {
      response = await this.cmsElasticsearchService.getCategoryPages(
        getElasticsearchIndex(input.lang),
        { ...input, organization: ICELANDIC_HEALTH_INSURANCE },
      )
    }

    return response
  }

  @CacheControl(defaultCache)
  @Query(() => EntryTitle, { nullable: true })
  async getSingleEntryTitleById(
    @Args('input') input: GetSingleEntryTitleByIdInput,
  ): Promise<EntryTitle | null> {
    const document = await this.cmsElasticsearchService.getSingleDocumentById(
      getElasticsearchIndex(input.lang),
      input.id,
    )
    if (typeof document?.title !== 'string') return null
    return { title: document.title }
  }
}

@Resolver(() => LatestNewsSlice)
@CacheControl(defaultCache)
export class LatestNewsSliceResolver {
  constructor(private cmsElasticsearchService: CmsElasticsearchService) {}

  @CacheControl(defaultCache)
  @ResolveField(() => [News])
  async news(@Parent() { news: input }: LatestNewsSlice): Promise<News[]> {
    let newsList = await this.cmsElasticsearchService.getNews(
      getElasticsearchIndex(input.lang),
      input,
    )

    if (!newsList.items.length && input.organization === ICELAND_HEALTH) {
      newsList = await this.cmsElasticsearchService.getNews(
        getElasticsearchIndex(input.lang),
        { ...input, organization: ICELANDIC_HEALTH_INSURANCE },
      )
    }

    return newsList.items
  }
}

@Resolver(() => LatestEventsSlice)
@CacheControl(defaultCache)
export class LatestEventsSliceResolver {
  constructor(private cmsElasticsearchService: CmsElasticsearchService) {}

  @CacheControl(defaultCache)
  @ResolveField(() => [EventModel])
  async events(
    @Parent() { events: input }: LatestEventsSlice,
  ): Promise<EventModel[]> {
    let eventsList = await this.cmsElasticsearchService.getEvents(
      getElasticsearchIndex(input.lang),
      input,
    )

    if (!eventsList.items.length && input.organization === ICELAND_HEALTH) {
      eventsList = await this.cmsElasticsearchService.getEvents(
        getElasticsearchIndex(input.lang),
        { ...input, organization: ICELANDIC_HEALTH_INSURANCE },
      )
    }

    return eventsList.items
  }
}

@Resolver(() => Article)
@CacheControl(defaultCache)
export class ArticleResolver {
  constructor(private cmsContentfulService: CmsContentfulService) {}

  @CacheControl(defaultCache)
  @ResolveField(() => [Article])
  async relatedArticles(
    @Parent() article: (Article & { lang?: Locale }) | null,
  ): Promise<Article[]> {
    if (!article) return []

    return this.cmsContentfulService.getRelatedArticles(
      article.slug,
      article?.lang ?? 'is',
    )
  }
}

@Resolver(() => FeaturedArticles)
@CacheControl(defaultCache)
export class FeaturedArticlesResolver {
  constructor(private cmsElasticsearchService: CmsElasticsearchService) {}

  @ResolveField(() => [Article])
  async resolvedArticles(
    @Parent() { resolvedArticles: input }: FeaturedArticles,
  ): Promise<Article[]> {
    if (input.size === 0) {
      return []
    }
    let response = await this.cmsElasticsearchService.getArticles(
      getElasticsearchIndex(input.lang),
      input,
    )

    if (!response.length && input.organization === ICELAND_HEALTH) {
      response = await this.cmsElasticsearchService.getArticles(
        getElasticsearchIndex(input.lang),
        { ...input, organization: ICELANDIC_HEALTH_INSURANCE },
      )
    }

    return response
  }
}

@Resolver(() => FeaturedSupportQNAs)
@CacheControl(defaultCache)
export class FeaturedSupportQNAsResolver {
  constructor(private cmsElasticsearchService: CmsElasticsearchService) {}

  @ResolveField(() => [SupportQNA])
  async resolvedSupportQNAs(
    @Parent() { resolvedSupportQNAs: input }: FeaturedSupportQNAs,
  ): Promise<SupportQNA[]> {
    if (input.size === 0) {
      return []
    }
    let response = await this.cmsElasticsearchService.getFeaturedSupportQNAs(
      getElasticsearchIndex(input.lang),
      input,
    )

    if (!response.length && input.organization === ICELAND_HEALTH) {
      response = await this.cmsElasticsearchService.getFeaturedSupportQNAs(
        getElasticsearchIndex(input.lang),
        { ...input, organization: ICELANDIC_HEALTH_INSURANCE },
      )
    }

    return response
  }
}

@Resolver(() => PowerBiSlice)
export class PowerBiSliceResolver {
  constructor(private powerBiService: PowerBiService) {}

  @ResolveField(() => GetPowerBiEmbedPropsFromServerResponse, {
    nullable: true,
  })
  async powerBiEmbedPropsFromServer(@Parent() powerBiSlice: PowerBiSlice) {
    return this.powerBiService.getEmbedProps(powerBiSlice)
  }
}
