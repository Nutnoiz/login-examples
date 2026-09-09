import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { Auth } from '../services/auth';

import {
  Menu,
  MenuItem,
  MenuResponse
} from '../services/menu';


export interface MenuNode extends MenuItem {

  children: MenuNode[];

  expanded: boolean;

}


@Component({
  selector: 'app-main',

  standalone: true,

  imports: [],

  templateUrl: './main.html',

  styleUrl: './main.css'
})
export class Main implements OnInit {


  user: any = null;

  menus: MenuNode[] = [];

  loading = false;

  errorMessage = '';


  constructor(

    private auth: Auth,

    private menuService: Menu,

    private cdr: ChangeDetectorRef

  ) {}


  // ============================================================
  // COMPONENT INIT
  // ============================================================

  ngOnInit(): void {

    console.log(
      'MAIN COMPONENT START'
    );


    // ----------------------------------------------------------
    // Load current user
    // ----------------------------------------------------------

    this.user =
      this.auth.getUser();


    console.log(
      'Current user:',
      this.user
    );


    // ----------------------------------------------------------
    // User not found
    // ----------------------------------------------------------

    if (!this.user) {

      this.errorMessage =
        'ไม่พบข้อมูลผู้ใช้งาน';

      this.loading = false;

      this.cdr.detectChanges();

      return;

    }


    // ----------------------------------------------------------
    // Load Menu
    // ----------------------------------------------------------

    this.loadMenu();

  }


  // ============================================================
  // LOAD MENU
  // ============================================================

  loadMenu(): void {

    console.log(
      'Loading menu...'
    );


    this.loading = true;

    this.errorMessage = '';


    this.cdr.detectChanges();


    // ----------------------------------------------------------
    // Call Menu API
    // ----------------------------------------------------------

    this.menuService

      .getMenu(

        this.user.user_id,

        this.user.role_id

      )

      .subscribe({

        // ======================================================
        // SUCCESS
        // ======================================================

        next: (
          response: MenuResponse
        ) => {

          console.log(
            'Menu response:',
            response
          );


          if (
            response.success
          ) {

            // --------------------------------------------------
            // Build Menu Tree
            // --------------------------------------------------

            this.menus =
              this.buildMenuTree(
                response.menus
              );


            console.log(
              'Menu tree:',
              this.menus
            );


            // --------------------------------------------------
            // Clear error
            // --------------------------------------------------

            this.errorMessage = '';


          } else {

            // --------------------------------------------------
            // API returned success = false
            // --------------------------------------------------

            this.menus = [];

            this.errorMessage =
              response.message ||
              'ไม่สามารถโหลด Menu ได้';

          }


          // ----------------------------------------------------
          // Loading finished
          // ----------------------------------------------------

          this.loading = false;


          // ----------------------------------------------------
          // Force Angular view update
          // ----------------------------------------------------

          this.cdr.detectChanges();

        },


        // ======================================================
        // ERROR
        // ======================================================

        error: (
          error: any
        ) => {

          console.error(
            'Menu API error:',
            error
          );


          this.menus = [];

          this.loading = false;


          this.errorMessage =
            'ไม่สามารถเชื่อมต่อ Menu API ได้';


          this.cdr.detectChanges();

        }

      });

  }


  // ============================================================
  // BUILD MENU TREE
  // ============================================================

  private buildMenuTree(
    items: MenuItem[]
  ): MenuNode[] {


    const map =
      new Map<number, MenuNode>();


    const roots: MenuNode[] = [];


    // ----------------------------------------------------------
    // Create Menu Nodes
    // ----------------------------------------------------------

    for (
      const item of items
    ) {

      map.set(

        item.menu_id,

        {

          ...item,

          children: [],

          expanded: false

        }

      );

    }


    // ----------------------------------------------------------
    // Connect Parent / Child
    // ----------------------------------------------------------

    for (
      const node of map.values()
    ) {

      if (

        node.parent_id !== null &&

        map.has(
          node.parent_id
        )

      ) {

        const parent =
          map.get(
            node.parent_id
          );


        if (parent) {

          parent.children.push(
            node
          );

        }

      } else {

        roots.push(
          node
        );

      }

    }


    // ----------------------------------------------------------
    // Sort Root Menu
    // ----------------------------------------------------------

    roots.sort(

      (
        a,
        b
      ) =>
        a.sort_order -
        b.sort_order

    );


    // ----------------------------------------------------------
    // Sort Child Menu
    // ----------------------------------------------------------

    for (
      const root of roots
    ) {

      root.children.sort(

        (
          a,
          b
        ) =>
          a.sort_order -
          b.sort_order

      );

    }


    return roots;

  }


  // ============================================================
  // TOGGLE MENU
  // ============================================================

  toggleMenu(
    menu: MenuNode
  ): void {


    // ----------------------------------------------------------
    // Menu without children
    // ----------------------------------------------------------

    if (
      menu.children.length === 0
    ) {

      return;

    }


    // ----------------------------------------------------------
    // Toggle expanded state
    // ----------------------------------------------------------

    menu.expanded =
      !menu.expanded;


    console.log(
      'Menu toggle:',
      menu.menu_name,
      'expanded =',
      menu.expanded
    );


    this.cdr.detectChanges();

  }


  // ============================================================
  // OPEN MENU
  // ============================================================

  openMenu(
    menu: MenuNode
  ): void {


    console.log(
      'Menu clicked:',
      menu
    );


    // ----------------------------------------------------------
    // Parent Menu
    // ----------------------------------------------------------

    if (
      menu.children.length > 0
    ) {

      this.toggleMenu(
        menu
      );

      return;

    }


    // ----------------------------------------------------------
    // Menu without page
    // ----------------------------------------------------------

    if (

      !menu.page ||

      menu.page === '#'

    ) {

      console.log(
        'Menu has no page:',
        menu.menu_name
      );

      return;

    }


    // ----------------------------------------------------------
    // Open Page
    // ----------------------------------------------------------

    console.log(
      'Open page:',
      menu.page
    );

  }

}