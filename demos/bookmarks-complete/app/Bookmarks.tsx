/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />

import watchUtils = require("esri/core/watchUtils");
import { aliasOf, declared, property, subclass } from "esri/core/accessorSupport/decorators";

import Widget = require("esri/widgets/Widget");
import { accessibleHandler, renderable, tsx } from "esri/widgets/support/widget";

import BookmarksViewModel = require("./Bookmarks/BookmarksViewModel");
import BookmarkItem = require("./Bookmarks/BookmarkItem");

import MapView = require("esri/views/MapView");

import i18n = require("dojo/i18n!./Bookmarks/nls/Bookmarks");

const CSS = {
  base: "demo-bookmarks",
  baseIconClass: "esri-icon-labels",
  bookmarkList: "demo-bookmarks__list",
  bookmarkItem: "demo-bookmarks__item",
  bookmarkItemActive: "demo-bookmarks__item--active"
};

@subclass("demo.Bookmarks")
class Bookmarks extends declared(Widget) {

  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  constructor(params?: any) {
    super();
  }

  postInitialize() {
    // todo: watch each bookmarkItem active property
    this.own(
      watchUtils.on(this, "viewModel.bookmarkItems", "change", () => this.scheduleRender())
    );
  }

  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  //----------------------------------
  //  iconClass
  //----------------------------------

  @property()
  iconClass = CSS.baseIconClass;

  //----------------------------------
  //  label
  //----------------------------------

  @property()
  label = i18n.label;

  //----------------------------------
  //  view
  //----------------------------------

  @aliasOf("viewModel.view")
  view: MapView = null;

  //----------------------------------
  //  viewModel
  //----------------------------------

  @property({
    type: BookmarksViewModel
  })
  @renderable([
    "state"
  ])
  viewModel: BookmarksViewModel = new BookmarksViewModel();

  //--------------------------------------------------------------------------
  //
  //  Public Methods
  //
  //--------------------------------------------------------------------------

  render() {
    // todo: use state
    const bookmarkNodes = this._renderBookmarks();

    const bookmarkListNode = bookmarkNodes.length ? [
      <ul aria-label={i18n.label} class={CSS.bookmarkList}>{bookmarkNodes}</ul>
    ] : null;

    return (
      <div class={CSS.base}>{bookmarkListNode}</div>
    );
  }

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

  private _renderBookmarks(): any {
    const { bookmarkItems } = this.viewModel;

    return bookmarkItems.toArray().map(bookmarkItem => this._renderBookmark(bookmarkItem));
  }

  private _renderBookmark(bookmarkItem: BookmarkItem): any {
    const { active, name } = bookmarkItem;

    const bookmarkItemClasses = {
      [CSS.bookmarkItemActive]: active
    };

    return (
      <li bind={this}
        data-bookmark-item={bookmarkItem}
        class={CSS.bookmarkItem}
        classes={bookmarkItemClasses}
        onclick={this._goToBookmark}
        onkeydown={this._goToBookmark}
        tabIndex={0}
        role="button"
        aria-label={name}
      >{name}</li>
    );
  }

  @accessibleHandler()
  private _goToBookmark(event: Event): void {
    const node = event.currentTarget as Element;
    const bookmarkItem = node["data-bookmark-item"] as BookmarkItem;
    this.viewModel.goTo(bookmarkItem);
  }

}

export = Bookmarks;
