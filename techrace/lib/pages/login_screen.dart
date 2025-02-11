import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:techrace/controllers/LoginController.dart';
import 'package:techrace/utils/MStyles.dart';

class LoginScreen extends StatelessWidget {
  LoginScreen({Key? key}) : super(key: key);

  // LoginScreen({Key? key}) :  super(key: key) { maybe don't do this here
  //   final tid = MLocalStorage().getTeamID();
  //   // final tid = MLocalStorage.tid; //doesnt work
  //   if ( tid  != "-999") {
  //     Get.off(() => RegistrationScreen(teamId: tid));
  //   }
  // }

  LoginController loginController = LoginController();
  final FocusNode _passwordFocusNode = FocusNode();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // appBar: AppBar(
      //   systemOverlayStyle: SystemUiOverlayStyle(
      //     systemNavigationBarColor: Colors.blue, // Navigation bar
      //     statusBarColor: Colors.pink, // Status bar
      //   ),
      // ),
      resizeToAvoidBottomInset: false,
      body: Center(
          child: Stack(
        alignment: Alignment.center,
    
        // crossAxisAlignment: CrossAxisAlignment.center,
        // mainAxisSize: MainAxisSize.max,
        // mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Column(
            children: [
              Flexible(
                child: Material(
                  elevation: 0,
                  // borderOnForeground: true,
                  clipBehavior: Clip.antiAlias,
                  shape: BeveledRectangleBorder(
                    // side: BorderSide(color: Colors.blue), if you need
                    borderRadius: BorderRadius.only(
                        // topLeft: Radius.circular(0),
                        // topRight: Radius.circular(0),
                        //   bottomLeft: Radius.circular(27.w),
                        // bottomRight: Radius.circular(27.w)),
                        bottomRight: Radius.circular(200.h), //blue
                        topLeft: Radius.circular(200.h)),
                  ),
    
                  child: Container(
                    // height: ScreenUtil().screenHeight * 0.7 + 4,
    
                    // width: 100,
                    decoration: const BoxDecoration(
                        color: Color(0xff2e92da),
                        border: Border(
                            bottom: BorderSide(// width: 10
                                // width: 100
                                ))
                        // borderRadius: BorderRadius.circular(15.0),
                        ),
                  ),
                ),
              ),
            ],
          ),
          Column(
            children: [
              Flexible(
                child: Material(
                  elevation: 0,
                  // borderOnForeground: true,
                  clipBehavior: Clip.antiAlias,
                  shape: BeveledRectangleBorder(
                    // side: BorderSide(color: Colors.blue), if you need
                    borderRadius: BorderRadius.only(
                        // topLeft: Radius.circular(0),
                        // topRight: Radius.circular(0),
                        //   bottomLeft: Radius.circular(27.w),
                        // bottomRight: Radius.circular(27.w)),
                        bottomRight: Radius.circular(225.h),
                        topLeft: Radius.circular(225.h)),
                  ),
    
                  child: Container(
                    // height: ScreenUtil().screenHeight * 0.7,
    
                    // width: 100,
                    decoration: const BoxDecoration(
                        color: Color(0xff121827),
                        border: Border(
                            bottom: BorderSide(// width: 10
                                // width: 100
                                ))
                        // borderRadius: BorderRadius.circular(15.0),
                        ),
                  ),
                ),
              ),
            ],
          ),
          // Align(
          //   alignment: Alignment.topCenter,
          //   child: Padding(
          //     padding: EdgeInsets.only(top: 70.w),
          //     child: Image.asset(
          //       "assets/images/techrace_logo.png",
          //       height: 50.w,
          //     ),
          //   ),
          // ),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Image.asset(
                  "assets/images/tr.png",
                  height: 175.w,
                ),
                SizedBox(height: 16.w),
                TextField(
                  controller: loginController.teamId,
                  decoration: const InputDecoration(
                      border: OutlineInputBorder(), labelText: "Team ID"),
                    // show next button on keyboard
                  textInputAction: TextInputAction.next,
                  onSubmitted: (value) {
                    // go to next field
                    _passwordFocusNode.requestFocus();
                  },
                ),
                SizedBox(
                  height: 16.w,
                ),
                Obx(
                  () => TextField(
                    focusNode: _passwordFocusNode,
                      obscureText: loginController.isHidden.value,
                      controller: loginController.password,
                      textInputAction: TextInputAction.done,
                      onSubmitted: (value) => loginController.login(),
                      decoration: InputDecoration(
                          border: const OutlineInputBorder(),
                          suffixIcon: GestureDetector(
                              onTap: () {
                                loginController.toggleHidden();
                              },
                              child: Icon(loginController.isHidden.value
                                  ? Icons.visibility
                                  : Icons.visibility_off)),
                          labelText: "Password")),
                ),
                Padding(
                  padding:
                      EdgeInsets.symmetric(horizontal: 0.w, vertical: 30.w),
                  child: ElevatedButton(
                      onPressed: () => {
                        // close keyboard
                        FocusScope.of(context).unfocus(),
                        loginController.login()},
                      clipBehavior: Clip.antiAlias,
                      style: ElevatedButton.styleFrom(
                          minimumSize: const Size.fromHeight(50),
                          shape: BeveledRectangleBorder(
                              borderRadius:
                                  BorderRadius.all(Radius.circular(10.w)))),
                      child: Text("LOGIN",
                          style: TextStyle(
                              fontSize: 18.w, fontWeight: FontWeight.w700))
                      // ButtonStyle(
                      //     shape: MaterialStateProperty.all(
                      //       BeveledRectangleBorder(
                      //           borderRadius: BorderRadius.all(Radius.circular(4))),
                      //     )).copyWith(
                      //   minimumSize: Size.fromHeight(50)
                      // ),
                      ),
                ),
                SizedBox(
                  height: 100.h,
                )
              ],
            ),
          ),
          //  add positioned here only when loading
          //   TweenAnimationBuilder(tween: tween, duration: duration, builder: builder)
    
          // Obx(() => !loginController.isLoginLoading.value ? SizedBox(): Positioned.fill( child: Container(color: MStyles.darkBgColor.withOpacity(0.5), child: Center(child: CircularProgressIndicator()))))
          Obx(() => !loginController.isLoginLoading.value
              ? const SizedBox()
              : TweenAnimationBuilder(
                  tween: Tween(begin: 0, end: 0.5),
                  duration: const Duration(milliseconds: 500),
                  builder:
                      (BuildContext context, Object? value, Widget? child) {
                    return Positioned.fill(
                        child: Container(
                      color: MStyles.darkBgColor.withOpacity(
                          double.parse( value.toString())
                      // 0.5
                      ),
                      child: const Center(child: CircularProgressIndicator()),
                    ));
                  },
                ))
        ],
      )),
    );
  }
}
