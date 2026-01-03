extern crate proc_macro;

use proc_macro::TokenStream;

mod builder;
mod getters;
mod new;

#[proc_macro_derive(Builder)]
pub fn derive_builder(input: TokenStream) -> TokenStream {
    builder::derive_builder_impl(input)
}

#[proc_macro_derive(Getters)]
pub fn derive_getters(input: TokenStream) -> TokenStream {
    getters::derive_getters_impl(input)
}

#[proc_macro_derive(New)]
pub fn derive_new(input: TokenStream) -> TokenStream {
    new::derive_new_impl(input)
}
