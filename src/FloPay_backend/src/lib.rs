use candid::CandidType;
use serde::{Deserialize, Serialize};
use std::cell::RefCell;
use std::collections::HashMap;
use ic_cdk::api::caller;
use ic_cdk_macros::{query, update};

#[derive(Clone, Debug, CandidType, Deserialize)]
 struct User {
    name: String,
    balance: u64,
}

thread_local! {
    static USERS: RefCell<HashMap<String, User>> = RefCell::new(HashMap::new());
}

#[update]
 fn add_user(name: String) {
    let principal = caller().to_string();
    USERS.with(|users| {
        users.borrow_mut().insert(principal.clone(), User {
            name,
            balance: 1000,
        });
    });
}

#[query]
 fn get_balance() -> Option<u64> {
    let principal = caller().to_string();
    USERS.with(|users| {
        users.borrow().get(&principal).map(|u| u.balance)
    })
}

#[update]
 fn transfer(to: String, amount: u64) -> bool {
    let from_principal = caller().to_string();
    USERS.with(|users| {
        let mut db = users.borrow_mut();

        if let Some(from_user) = db.get(&from_principal).cloned() {
            if let Some(to_user) = db.get(&to).cloned() {
                if from_user.balance >= amount {
                    db.insert(from_principal.clone(), User {
                        name: from_user.name,
                        balance: from_user.balance - amount,
                    });
                    db.insert(to.clone(), User {
                        name: to_user.name,
                        balance: to_user.balance + amount,
                    });
                    return true;
                }
            }
        }
        false
    })
}

#[query]
fn get_user_list() -> Vec<String> {
    USERS.with(|users| users.borrow().keys().cloned().collect())
}

ic_cdk::export_candid!();
