VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  # config.vm.box = "ubuntu/trusty64"
  # reason for bento: https://bugs.launchpad.net/cloud-images/+bug/1569237
  config.vm.box = "bento/ubuntu-16.04"

  config.vm.network "forwarded_port", guest: 80, host: 8090
  config.vm.network "forwarded_port", guest:22, host: 2223, id:'ssh'

  config.vm.synced_folder "./", "/var/www",
    owner: "www-data",
    group: "www-data",
    mount_options: ["dmode=775,fmode=664"]

  config.vm.synced_folder "./", "/vagrant", id: "vagrant-root", disabled: true



  config.vm.provider "virtualbox" do |v|
    v.memory = 4096
    v.cpus = 2
  end
end