import { Component, OnInit, ViewChild } from "@angular/core";
import { NavController, NavParams, AlertController } from "ionic-angular";
import { JobtivityDetailPage } from "../jobtivity-detail/jobtivity-detail";
import { AuthProvider } from "../../providers/auth/auth";
import { Category } from "../../providers/CustomClasses/Users";

@Component({
  selector: "page-sub-category",
  templateUrl: "sub-category.html"
})
export class SubCategoryPage implements OnInit {
  @ViewChild('search') search: any;

  categoryList: Category[];
  selectedSubCat: Category;
  catId: number;
  pageData: object = {};

  IsTextfield: boolean = true;
  IsAutoComplete: boolean = true;
  Islist: boolean = true;
  IsmultiSelect: boolean = false;
  Subcategory: string = "";
  SubcategoryQuest: string = "";
  showList: boolean = false;
  searchQuery: string = '';
  items: string[] = [];
  itemsList: string[] = [];
  SelectedValue: string;
  listSelected: string[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public auth: AuthProvider,
    private alert: AlertController
  ) {
    this.catId = this.navParams.get("catID");
    this.pageData = this.navParams.get("data");
    setTimeout(() => {
      this.search.setFocus();
    }, 500);
  }
  ngOnInit() {
    this.catId = this.navParams.get("catID");
    //this.getCategoriseList(this.catId);
    this.DisplayList(this.catId, this.navParams.get("tag"))

  }
  DisplayList(catId: number, tag: string) {
    if (tag.trim().toLowerCase() == "knowledge".toLowerCase()) {
      this.SubcategoryQuest = "Which topic does the new knowledge fall into?";
      this.getCourseList("");
      this.IsAutoComplete = false;
      this.IsmultiSelect = true;
    }
    else if (tag.trim().toLowerCase() == "volunteering".toLowerCase()) {
      this.SubcategoryQuest = "What is the full name of the event?";
      this.IsTextfield = false;
    }
    else if (tag.trim().toLowerCase() == "organisational skill") {
      this.SubcategoryQuest = " What role did you play?";
      this.getCategoriseList(catId, 'list');
      this.Islist = false;
    }
    else if (tag.trim().toLowerCase() == "personal interest") {
      this.SubcategoryQuest = "Choose your hobby / interest.";
      this.getCourseList("Personal Interest");
      this.IsAutoComplete = false;
      this.IsmultiSelect = true;
    }
    else if (tag.trim().toLowerCase() == "course") {
      this.SubcategoryQuest = "What type of skills did you learn?";
      this.getCourseList("Skills");
      this.IsAutoComplete = false;
      this.IsmultiSelect = true;
    }
    else if (tag.trim().toLowerCase() == "sports") {
      this.SubcategoryQuest = "Through what activity did you socialise or play in?";
      this.getCourseList("Sports");
      this.IsAutoComplete = false;
      this.IsmultiSelect = false;
    }
    else if (tag.trim().toLowerCase() == "entrepreneurial") {
      this.SubcategoryQuest = "What activity did you do to earn that income?";
      this.getCourseList("Entrepreneurial");
      this.IsAutoComplete = false;
      this.IsmultiSelect = false;
    }
  }


  getCategoriseList(catId: number, type: string) {
    this.auth.getSubCategorise(catId).subscribe(
      res => {
        if (type == 'autocomplete') {
          let List = res;
          List.forEach(each => {
            this.itemsList.push(each["category_name"]);
          });
        } else {
          this.categoryList = res;
          this.categoryList.forEach(each => {
            each.imgURL = each["photo"];
          });
          if (catId == 2)
            this.array_move(this.categoryList, 5, 8);
        }
      },
      error => {
      }
    );
  }
  array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
      var k = new_index - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
  };

  getCourseList(type: string) {
    if (type == "") {
      this.auth.getCourses().subscribe(
        res => {
          let List = res;
          List.forEach(each => {
            this.itemsList.push(each["course_name"]);
          });
        },
        error => {
        }
      );
    } else {
      this.auth.getCoursesType(type).subscribe(
        res => {
          let List = res;
          List.forEach(each => {
            this.itemsList.push(each["course_name"]);
          });
        },
        error => {
        }
      );
    }

  }


  selectedSubCategory(catgory: Category) {
    this.categoryList.forEach(each => {
      each.checked = false;
    });
    catgory.checked = true;
    this.selectedSubCat = catgory;
    this.pageData["subCategories"] = this.categoryList;
    this.navCtrl.push(JobtivityDetailPage, {
      catID: this.catId,
      subCatID: catgory.id,
      data: this.pageData,
      value: catgory.category_name,
      list:""
    });
  }
  presentAlert(error) {
    let alert = this.alert.create({
      subTitle: error,
      buttons: ["Ok"]
    });
    alert.present();
  }
  saveJotivity() {
    if (this.selectedSubCat != null && this.selectedSubCat != undefined)
      this.navCtrl.push(JobtivityDetailPage, {
        catID: this.catId,
        subCatID: this.selectedSubCat.id,
        data: this.pageData,
        value: ""
      });
  }
  UserContinue(num: number) {
    console.log(this.Subcategory);
    console.log(this.SelectedValue);
    if (num == 1) {
      if (this.Subcategory != undefined && this.Subcategory != "") {
        this.navCtrl.push(JobtivityDetailPage, {
          catID: this.catId,
          subCatID: 0,
          data: this.pageData,
          value: this.Subcategory,
          list: this.listSelected
        });
      }
    } else if (num == 2) {
      if (this.SelectedValue != undefined && this.SelectedValue != null && this.SelectedValue != "")
        this.listSelected.push(this.SelectedValue);
      if (this.listSelected != undefined && this.listSelected.length > 0) {
        this.navCtrl.push(JobtivityDetailPage, {
          catID: this.catId,
          subCatID: 0,
          data: this.pageData,
          value: "",
          list: this.listSelected
        });
      }
    }
  }

  initializeItems() {
    this.items = this.itemsList;
  }
  onKeyPressed(event) {
    console.log(event.keyCode);
    let val = this.SelectedValue;
    if (event.keyCode == 13 || event.keyCode == 44) {
      if (val.indexOf(",") != -1) {
        val = val.substring(val.indexOf(","), 0);
      }
      if (val != "") {
        let Id = this.listSelected.indexOf(val);
        if (Id == -1)
          this.listSelected.push(val);
        setTimeout(() => {
          this.search.setFocus();
          this.SelectedValue = "";
        }, 5);
      }
    }
    return true
  }
  getItems(ev: any) {
    this.initializeItems();
    let val = ev.target.value;
    console.log(ev);
    if (val && val.trim() != '') {
      if (val.indexOf(",") != -1) {
        val = val.substring(val.indexOf(","), 0);
        if (val != "") {
          let Id = this.listSelected.indexOf(val);
          if (Id == -1)
            this.listSelected.push(val);
          setTimeout(() => {
            this.search.setFocus();
            this.SelectedValue = "";
          }, 5);
        }
      }
      if (this.listSelected.length > 0) {
        let tempArr: string[] = [];
        this.items.forEach(each => {
          if (this.listSelected.indexOf(each) == -1) {
            tempArr.push(each)
          }
        });
        this.items = tempArr;
      }
      this.items = this.items.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
      this.showList = true;
    } else {
      this.showList = false;
    }
  }
  itemSelected(item: string) {
    this.showList = false;
    if (this.IsmultiSelect) {
      let Id = this.listSelected.indexOf(item);
      if (Id == -1)
        this.listSelected.push(item);
      this.SelectedValue = "";
    } else {
      this.SelectedValue = item;
    }
    this.search.setFocus();

    //setTimeout(() => {
    //  //this.search.setFocus();
    //  ////this.search.placeholder = "";
    //  //this.SelectedValue = "";
    //}, 5);
  }
  RemoveCourse(val: string) {
    let Id = this.listSelected.indexOf(val);
    this.listSelected.splice(Id, 1);
    this.search.setFocus();
    //setTimeout(() => {
    //  this.search.setFocus();
    //}, 5);
  }
  selectALL() {

  }
}
